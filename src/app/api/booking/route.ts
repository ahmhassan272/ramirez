import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');
const prisma = new PrismaClient();

const LOCATIONS = {
  premium: {
    name: 'Ramirez Prémium Siófok',
    address: 'Siófok, Fő u. 43, 8600',
    google: 'https://g.page/r/CQ-tGOhcfqcaEAE/review',
    tripAdvisor: 'https://www.tripadvisor.com/Restaurant_Review-g274908-d34475164-Reviews-Ramirez_Premium_Siofok-Siofok_Somogy_County_Southern_Transdanubia.html'
  },
  etterem: {
    name: 'Ramirez Éttermek Siófok',
    address: 'Siófok, Mártírok útja 15, 8600',
    google: 'https://g.page/r/CYVLFPM24Q2jEAE/review',
    tripAdvisor: 'https://www.tripadvisor.com/Restaurant_Review-g274908-d12479175-Reviews-Ramirez_Ettermek_Siofok-Siofok_Somogy_County_Southern_Transdanubia.html'
  },
  halaszle: {
    name: 'Ramirez Halászlé és Sült Hal Udvar',
    address: 'Siófok, 8600',
    google: 'https://www.google.com/search?sa=X&sca_esv=0534c7d920db149e&rlz=1C5CHFA_enKW881KW881&sxsrf=APpeQnugV6NQy3dEqOdW_cTuBe75uUXetA:1782134840883&q=Ramirez+Hal%C3%A1szl%C3%A9+%C3%A9s+S%C3%BClt+Hal+Udvar+Reviews&rflfq=1&num=20&stick=H4sIAAAAAAAAAONgkxIxNDM0NTMxsbQ0NTCxMDUyM7KwtNzAyPiKUS8oMTezKLVKwSMx5_DC4qqcwysVDq8sVgg-vCenBCSoEJpSllikEJRalplaXryIlUQNALW7H-t9AAAA&rldimm=16156449950485262899&tbm=lcl&hl=en-HU&ved=2ahUKEwi0uofR-ZqVAxXj3QIHHYLHAHgQ9fQKegQIJRAG&biw=1440&bih=812&dpr=2#lkt=LocalPoiReviews&lrd=0x4769c1007120e2cb:0xe0373da1220d3233,3',
    tripAdvisor: 'https://www.tripadvisor.com/Restaurant_Review-g274908-d34475174-Reviews-Ramirez_Halaszle_es_Sult_Hal_Udvar-Siofok_Somogy_County_Southern_Transdanubia.html'
  }
};

export async function POST(request: Request) {
  let customerPayload: { Name?: string; Time?: string; Date?: string; [key: string]: any } = {};

  try {
    const body = await request.json();

    // Explicitly define the expected payload type
    const { name, email, phone, guests, date, time, restaurant } = body as {
      name: string;
      email: string;
      phone?: string;
      guests: string | number;
      date: string;
      time: string;
      restaurant: string;
    };

    customerPayload = {
      Name: name,
      Time: time,
      Date: date,
      email,
      restaurant,
      guests,
    };

    const locationKey = restaurant as keyof typeof LOCATIONS;

    // Validation
    if (!name || !email || !guests || !date || !time || !locationKey || !LOCATIONS[locationKey]) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields or invalid restaurant selection.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address.' },
        { status: 400 }
      );
    }

    const locationDetails = LOCATIONS[locationKey];

    // ── Task 1 & 2: Isolated Database Write ─────────────────────────────
    try {
      if (process.env.DATABASE_URL) {
        await prisma.reservation.create({
          data: {
            restaurant: locationKey,
            name,
            email,
            phone: phone || null,
            guests: String(guests),
            date,
            time,
          },
        });
      } else {
        console.warn("DATABASE_URL is not set. Skipping Prisma DB insert.");
      }
    } catch (dbError: any) {
      const errorMessage = dbError instanceof Error ? dbError.message : String(dbError);
      const stackTrace = dbError instanceof Error ? dbError.stack : 'No stack trace available';

      console.error(
        `🚨 [VERCEL LOG] PRISMA DATABASE WRITE FAILED:\n` +
        `Error Message: ${errorMessage}\n` +
        `Stack Trace:\n${stackTrace}\n` +
        `Customer Payload: Name: "${name}", Time: "${time}", Date: "${date}"`
      );
      console.error('[PRISMA_DB_ERROR_CONTEXT]', {
        errorMessage,
        stack: stackTrace,
        customerPayload: {
          Name: name,
          Time: time,
          Date: date,
        },
      });

      return NextResponse.json(
        {
          success: false,
          message: 'Server busy, please try again or call the restaurant directly.',
          error: errorMessage,
        },
        { status: 500 }
      );
    }

    // ── Task 1 & 2: Isolated Resend Email Transmission ──────────────────
    // If the database write succeeded, email failure MUST NOT crash the system
    // or return an error to the user. The table is booked, so return success to user.
    try {
      // 1. Internal Notification Email
      try {
        const internalResponse = await resend.emails.send({
          from: 'reservations@ramirezrestaurant.hu',
          to: 'storyruns68@gmail.com',
          subject: `Új Foglalás / New Booking: ${name} — ${date} @ ${time}`,
          html: `
            <h2>Új Asztalfoglalás / New Reservation Request</h2>
            <p><strong>Étterem / Location:</strong> ${locationDetails.name}</p>
            <p><strong>Cím / Address:</strong> ${locationDetails.address}</p>
            <p><strong>Név / Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telefon / Phone:</strong> ${phone || '—'}</p>
            <p><strong>Vendégek / Guests:</strong> ${guests}</p>
            <p><strong>Dátum / Date:</strong> ${date}</p>
            <p><strong>Időpont / Time:</strong> ${time}</p>
          `,
        });

        if (internalResponse.error) {
          throw new Error(internalResponse.error.message || JSON.stringify(internalResponse.error));
        }
      } catch (internalError: any) {
        const errorMessage = internalError instanceof Error ? internalError.message : String(internalError);
        const stackTrace = internalError instanceof Error ? internalError.stack : 'No stack trace available';

        console.error(
          `🚨 [VERCEL LOG] RESEND INTERNAL NOTIFICATION EMAIL FAILED:\n` +
          `Error Message: ${errorMessage}\n` +
          `Stack Trace:\n${stackTrace}\n` +
          `Customer Payload: Name: "${name}", Time: "${time}", Date: "${date}"`
        );
        console.error('[RESEND_INTERNAL_EMAIL_ERROR_CONTEXT]', {
          errorMessage,
          stack: stackTrace,
          customerPayload: {
            Name: name,
            Time: time,
            Date: date,
          },
        });
      }

      // 2. Customer Confirmation Email
      try {
        const customerResponse = await resend.emails.send({
          from: 'reservations@ramirezrestaurant.hu',
          to: email, // Reverting to original customer email
          subject: `Foglalás Megerősítése / Reservation Received - Ramirez Éttermek`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1b2a4a;">
              <h2 style="color: #c8a951;">Kedves / Dear / Lieber ${name},</h2>
              
              <!-- HUNGARIAN -->
              <p>Köszönjük a foglalását a <strong>${locationDetails.name}</strong> étterembe!</p>
              <p>Hamarosan felvesszük Önnel a kapcsolatot a foglalás megerősítéséhez.</p>
              <p><strong>Cím:</strong> ${locationDetails.address}</p>

              <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />

              <!-- ENGLISH -->
              <p>Thank you for your reservation request at <strong>${locationDetails.name}</strong>!</p>
              <p>We will contact you shortly to confirm your booking.</p>
              <p><strong>Address:</strong> ${locationDetails.address}</p>

              <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />

              <!-- GERMAN -->
              <p>Vielen Dank für Ihre Reservierungsanfrage bei <strong>${locationDetails.name}</strong>!</p>
              <p>Wir werden uns in Kürze mit Ihnen in Verbindung setzen, um Ihre Buchung zu bestätigen.</p>
              <p><strong>Adresse:</strong> ${locationDetails.address}</p>

              <div style="background-color: #fdfbf7; padding: 20px; border-left: 4px solid #c8a951; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Dátum / Date / Datum:</strong> ${date}</p>
                <p style="margin: 5px 0;"><strong>Időpont / Time / Zeit:</strong> ${time}</p>
                <p style="margin: 5px 0;"><strong>Vendégek / Guests / Gäste:</strong> ${guests}</p>
              </div>
              <p>Üdvözlettel / Best regards / Mit freundlichen Grüßen,<br><strong>Ramirez Éttermek Siófok</strong></p>
            </div>
          `,
        });

        if (customerResponse.error) {
          throw new Error(customerResponse.error.message || JSON.stringify(customerResponse.error));
        }
      } catch (customerEmailError: any) {
        const errorMessage = customerEmailError instanceof Error ? customerEmailError.message : String(customerEmailError);
        const stackTrace = customerEmailError instanceof Error ? customerEmailError.stack : 'No stack trace available';

        console.error(
          `🚨 [VERCEL LOG] RESEND CUSTOMER CONFIRMATION EMAIL FAILED:\n` +
          `Error Message: ${errorMessage}\n` +
          `Stack Trace:\n${stackTrace}\n` +
          `Customer Payload: Name: "${name}", Time: "${time}", Date: "${date}"`
        );
        console.error('[RESEND_CUSTOMER_EMAIL_ERROR_CONTEXT]', {
          errorMessage,
          stack: stackTrace,
          customerPayload: {
            Name: name,
            Time: time,
            Date: date,
          },
        });
      }
    } catch (emailError: any) {
      const errorMessage = emailError instanceof Error ? emailError.message : String(emailError);
      const stackTrace = emailError instanceof Error ? emailError.stack : 'No stack trace available';

      console.error(
        `🚨 [VERCEL LOG] RESEND EMAIL TRANSMISSION ERROR:\n` +
        `Error Message: ${errorMessage}\n` +
        `Stack Trace:\n${stackTrace}\n` +
        `Customer Payload: Name: "${name}", Time: "${time}", Date: "${date}"`
      );
      console.error('[RESEND_EMAIL_ERROR_CONTEXT]', {
        errorMessage,
        stack: stackTrace,
        customerPayload: {
          Name: name,
          Time: time,
          Date: date,
        },
      });
      // Email failure does NOT crash or fail the request because DB write succeeded.
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Reservation request received. We will confirm shortly.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const stackTrace = error instanceof Error ? error.stack : 'No stack trace available';

    console.error(
      `🚨 [VERCEL LOG] BOOKING API ROUTE ERROR:\n` +
      `Error Message: ${errorMessage}\n` +
      `Stack Trace:\n${stackTrace}\n` +
      `Customer Payload: Name: "${customerPayload.Name || 'N/A'}", Time: "${customerPayload.Time || 'N/A'}", Date: "${customerPayload.Date || 'N/A'}"`
    );
    console.error('[BOOKING_ROUTE_ERROR_CONTEXT]', {
      errorMessage,
      stack: stackTrace,
      customerPayload: {
        Name: customerPayload.Name || 'N/A',
        Time: customerPayload.Time || 'N/A',
        Date: customerPayload.Date || 'N/A',
      },
    });

    return NextResponse.json(
      {
        success: false,
        message: 'Server busy, please try again or call the restaurant directly.',
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
