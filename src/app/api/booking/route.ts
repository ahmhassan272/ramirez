import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, guests, date, time, branch } = body;

    // ── Validation ──────────────────────────────────────
    if (!name || !email || !guests || !date || !time) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields.' },
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

    // ── Email Notification ──────────────────────────────
    
    // 1. Internal Notification Email
    await resend.emails.send({
      from: 'Ramirez Reservations <onboarding@resend.dev>',
      to: ['szaraz.vivien0601@gmail.com', 'ramirezsiofok11@gmail.com', 'ahmhassan272@gmail.com'],
      subject: `Új Foglalás / New Booking: ${name} — ${date} @ ${time}`,
      html: `
        <h2>Új Asztalfoglalás / New Reservation Request</h2>
        <p><strong>Név / Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefon / Phone:</strong> ${phone || '—'}</p>
        <p><strong>Vendégek / Guests:</strong> ${guests}</p>
        <p><strong>Dátum / Date:</strong> ${date}</p>
        <p><strong>Időpont / Time:</strong> ${time}</p>
        <p><strong>Étterem / Location:</strong> ${branch || 'Ramirez Premium'}</p>
      `,
    });

    // 2. Customer Confirmation Email
    // Note: To send emails to arbitrary addresses (like customer emails), 
    // you must verify a domain in Resend and update the 'from' address below.
    await resend.emails.send({
      from: 'Ramirez Étterem <onboarding@resend.dev>',
      to: email,
      subject: `Foglalás Megerősítése / Reservation Received - Ramirez Éttermek`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1b2a4a;">
          <h2 style="color: #c8a951;">Kedves / Dear ${name},</h2>
          <p>Köszönjük a foglalását! / Thank you for your reservation request!</p>
          <p>Hamarosan felvesszük Önnel a kapcsolatot a foglalás megerősítéséhez. / We will contact you shortly to confirm your booking.</p>
          <div style="background-color: #fdfbf7; padding: 20px; border-left: 4px solid #c8a951; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Dátum / Date:</strong> ${date}</p>
            <p style="margin: 5px 0;"><strong>Időpont / Time:</strong> ${time}</p>
            <p style="margin: 5px 0;"><strong>Vendégek / Guests:</strong> ${guests}</p>
            <p style="margin: 5px 0;"><strong>Étterem / Location:</strong> ${branch || 'Ramirez Premium'}</p>
          </div>
          <p>Üdvözlettel / Best regards,<br><strong>Ramirez Éttermek Siófok</strong></p>
        </div>
      `,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Reservation request received. We will confirm shortly.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
}
