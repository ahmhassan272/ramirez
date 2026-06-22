import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');

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

export async function GET(request: Request) {
  // Optional: Check Vercel Cron Secret for security
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // We want reservations created ~24 hours ago. 
    // For a daily cron running at 10:00 AM, we can check for reservations created yesterday.
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    let reservations: any[] = [];
    if (process.env.DATABASE_URL) {
      reservations = await prisma.reservation.findMany({
        where: {
          createdAt: {
            gte: fortyEightHoursAgo,
            lt: twentyFourHoursAgo,
          }
        }
      });
    }

    if (reservations.length === 0) {
      return NextResponse.json({ success: true, message: 'No reservations to review.' });
    }

    // Process all notifications concurrently
    await Promise.all(
      reservations.map(async (reservation) => {
        const locationDetails = LOCATIONS[reservation.restaurant as keyof typeof LOCATIONS];
        if (!locationDetails) return;

        // Skip missing emails
        if (!reservation.email) return;

        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1b2a4a; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #c8a951; margin-bottom: 5px;">${locationDetails.name}</h2>
              <p style="margin-top: 0; color: #666;">Kérjük, értékeljen minket! / Please review us! / Bitte bewerten Sie uns!</p>
            </div>

            <!-- HUNGARIAN -->
            <p>Kedves <strong>${reservation.name}</strong>!</p>
            <p>Reméljük, jól érezte magát tegnap a <strong>${locationDetails.name}</strong> étteremben!</p>
            <p>Sokat jelentene számunkra, ha megosztaná a tapasztalatait. Kérjük, szánjon egy percet az értékelésre az alábbi platformok egyikén:</p>

            <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />

            <!-- ENGLISH -->
            <p>Dear <strong>${reservation.name}</strong>,</p>
            <p>We hope you enjoyed your time yesterday at <strong>${locationDetails.name}</strong>!</p>
            <p>It would mean a lot to us if you could share your experience. Please take a minute to leave a review on one of the platforms below:</p>

            <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />

            <!-- GERMAN -->
            <p>Lieber <strong>${reservation.name}</strong>,</p>
            <p>Wir hoffen, Sie haben Ihre Zeit gestern bei <strong>${locationDetails.name}</strong> genossen!</p>
            <p>Es würde uns sehr viel bedeuten, wenn Sie Ihre Erfahrungen teilen könnten. Bitte nehmen Sie sich eine Minute Zeit für eine Bewertung auf einer der folgenden Plattformen:</p>

            <div style="text-align: center; margin: 40px 0;">
              <a href="${locationDetails.google}" style="display: inline-block; padding: 12px 24px; margin: 0 10px; background-color: #4285F4; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">Google Review</a>
              <a href="${locationDetails.tripAdvisor}" style="display: inline-block; padding: 12px 24px; margin: 0 10px; background-color: #34E0A1; color: #000; text-decoration: none; border-radius: 4px; font-weight: bold;">TripAdvisor Review</a>
            </div>

            <p style="text-align: center;">Üdvözlettel / Best regards / Mit freundlichen Grüßen,<br><strong>Ramirez Éttermek Siófok</strong></p>
          </div>
        `;

        await resend.emails.send({
          from: 'reservations@ramirezrestaurant.hu',
          to: 'ahmhassan272@gmail.com', // Using the test email to comply with Sandbox limits during testing
          subject: 'Értékelje a látogatását / Review your visit - Ramirez Éttermek',
          html: emailHtml,
        });
      })
    );

    return NextResponse.json({ success: true, processed: reservations.length });
  } catch (error) {
    console.error('Cron review API error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}
