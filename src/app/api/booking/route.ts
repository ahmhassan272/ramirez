import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { PrismaClient } from '@prisma/client';

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

    // Database Logging
    // Use a dummy connection test if the database URL isn't configured for local development
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
        }
      });
    } else {
      console.warn("DATABASE_URL is not set. Skipping Prisma DB insert.");
    }

    // 1. Internal Notification Email
    const internalResponse = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['szaraz.vivien0601@gmail.com', 'ramirezsiofok11@gmail.com', 'ahmhassan272@gmail.com'],
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
      console.error("🔥 RESEND API ERROR:", internalResponse.error);
      return NextResponse.json({ error: internalResponse.error.message }, { status: 500 });
    }

    // 2. Customer Confirmation Email
    const customerResponse = await resend.emails.send({
      from: 'onboarding@resend.dev',
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
      console.error("🔥 RESEND API ERROR:", customerResponse.error);
      return NextResponse.json({ error: customerResponse.error.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Reservation request received. We will confirm shortly.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Booking API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error.', error: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
