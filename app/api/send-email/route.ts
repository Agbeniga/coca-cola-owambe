

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';

interface EmailData {
  fullName: string;
  guestName: string;
  email: string;
  registrationId: string;
}

// Email template HTML
const getEmailTemplate = (data: EmailData, qrCodeBase64: string): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Owambe Extravaganza - Your Invitation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f5f5f5;">
  
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; max-width: 600px; width: 100%;">
          
          <tr>
            <td align="center" style="background-color: #F40009; padding: 40px 20px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold; line-height: 1.2;">
                🎉 Coca-Cola Owambe Extravaganza 🎉
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 30px;">
              
              <h2 style="font-size: 24px; color: #333333; margin: 0 0 20px 0; font-weight: bold;">
                Hello ${data.fullName}!
              </h2>

              <p style="font-size: 16px; color: #555555; line-height: 1.6; margin: 0 0 15px 0;">
                Congratulations! You have successfully registered for the <strong>Owambe Extravaganza</strong>.
              </p>
              
              <p style="font-size: 16px; color: #555555; line-height: 1.6; margin: 0 0 30px 0;">
                We are thrilled to have you join us for an unforgettable celebration filled with music, dance, food, and great company!
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f9f9f9; border-left: 4px solid #F40009; margin: 30px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="color: #F40009; margin: 0 0 15px 0; font-size: 20px; font-weight: bold;">
                      📅 Event Details
                    </h3>
                    
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding: 5px 0;">
                          <span style="font-weight: bold; color: #F40009; font-size: 15px;">Event:</span>
                          <span style="color: #333333; font-size: 15px;"> Owambe Extravaganza 2024</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0;">
                          <span style="font-weight: bold; color: #F40009; font-size: 15px;">Date:</span>
                          <span style="color: #333333; font-size: 15px;"> Saturday, December 21, 2024</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0;">
                          <span style="font-weight: bold; color: #F40009; font-size: 15px;">Time:</span>
                          <span style="color: #333333; font-size: 15px;"> 5:00 PM - 11:00 PM</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0;">
                          <span style="font-weight: bold; color: #F40009; font-size: 15px;">Venue:</span>
                          <span style="color: #333333; font-size: 15px;"> Grand Ballroom, Lagos Continental Hotel</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0;">
                          <span style="font-weight: bold; color: #F40009; font-size: 15px;">Dress Code:</span>
                          <span style="color: #333333; font-size: 15px;"> Traditional Attire / Smart Casual</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f9f9f9; border-left: 4px solid #F40009; margin: 30px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="color: #F40009; margin: 0 0 15px 0; font-size: 20px; font-weight: bold;">
                      👤 Your Registration Details
                    </h3>
                    
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding: 5px 0;">
                          <span style="font-weight: bold; color: #F40009; font-size: 15px;">Name:</span>
                          <span style="color: #333333; font-size: 15px;"> ${data.fullName}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0;">
                          <span style="font-weight: bold; color: #F40009; font-size: 15px;">Guest Name:</span>
                          <span style="color: #333333; font-size: 15px;"> ${data.guestName}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0;">
                          <span style="font-weight: bold; color: #F40009; font-size: 15px;">Email:</span>
                          <span style="color: #333333; font-size: 15px;"> ${data.email}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0;">
                          <span style="font-weight: bold; color: #F40009; font-size: 15px;">Registration ID:</span>
                          <span style="color: #333333; font-size: 15px;"> ${data.registrationId}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f9f9f9; border-radius: 8px; margin: 40px 0;">
                <tr>
                  <td align="center" style="padding: 30px;">
                    <h3 style="color: #333333; font-size: 20px; margin: 0 0 15px 0; font-weight: bold;">
                      🎫 Your Event Pass
                    </h3>
                    <p style="color: #666666; font-size: 14px; margin: 0 0 20px 0; line-height: 1.5;">
                      Please present this QR code at the entrance for quick check-in:
                    </p>
                    
                    <img src="${qrCodeBase64}" alt="Event QR Code" width="250" height="250" style="display: block; margin: 20px auto; max-width: 250px; height: auto; border: 2px solid #e0e0e0; padding: 10px; background-color: #ffffff;" />
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fff3cd; border-left: 4px solid #ffc107; margin: 20px 0;">
                <tr>
                  <td style="padding: 15px;">
                    <p style="margin: 0; font-size: 14px; color: #856404; line-height: 1.5;">
                      <strong>⚠️ Important:</strong> Please save this email or take a screenshot of your QR code. 
                      You will need to present it at the venue for entry. Ensure your phone is charged!
                    </p>
                  </td>
                </tr>
              </table>

              <p style="font-size: 16px; color: #333333; margin: 30px 0 10px 0; font-weight: bold;">
                What to Expect:
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding: 5px 0; font-size: 15px; color: #555555; line-height: 1.8;">
                    🎵 Live DJ performances
                  </td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; font-size: 15px; color: #555555; line-height: 1.8;">
                    🍽️ Delicious Nigerian cuisine
                  </td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; font-size: 15px; color: #555555; line-height: 1.8;">
                    💃 Traditional dance performances
                  </td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; font-size: 15px; color: #555555; line-height: 1.8;">
                    🎁 Amazing giveaways and prizes
                  </td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; font-size: 15px; color: #555555; line-height: 1.8;">
                    📸 Photo booth and professional photography
                  </td>
                </tr>
              </table>

              <p style="font-size: 16px; color: #555555; line-height: 1.6; margin: 30px 0 10px 0;">
                If you have any questions or need to make changes to your registration, please contact us at:
              </p>
              <p style="font-size: 15px; color: #555555; line-height: 1.8; margin: 0;">
                📧 Email: <a href="mailto:events@owambe.com" style="color: #F40009; text-decoration: none;">events@owambe.com</a><br>
                📱 Phone: +234 801 234 5678
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee;">
                <tr>
                  <td>
                    <p style="font-size: 16px; color: #555555; line-height: 1.6; margin: 0 0 10px 0;">
                      We can't wait to celebrate with you!
                    </p>
                    <p style="font-size: 16px; color: #333333; font-weight: bold; margin: 0;">
                      See you there! 🎊
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <tr>
            <td align="center" style="background-color: #333333; color: #ffffff; padding: 30px;">
              <p style="margin: 0 0 5px 0; font-size: 16px; font-weight: bold;">
                Owambe Extravaganza
              </p>
              <p style="margin: 0 0 20px 0; font-size: 14px;">
                Making Memories, Creating Moments
              </p>
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 20px 0;">
                <tr>
                  <td style="padding: 0 10px;">
                    <a href="https://facebook.com" style="color: #F40009; text-decoration: none; font-size: 14px;">Facebook</a>
                  </td>
                  <td style="color: #666666;">|</td>
                  <td style="padding: 0 10px;">
                    <a href="https://instagram.com" style="color: #F40009; text-decoration: none; font-size: 14px;">Instagram</a>
                  </td>
                  <td style="color: #666666;">|</td>
                  <td style="padding: 0 10px;">
                    <a href="https://twitter.com" style="color: #F40009; text-decoration: none; font-size: 14px;">Twitter</a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 12px; color: #999999; margin: 20px 0 0 0; line-height: 1.5;">
                © 2024 Owambe Extravaganza. All rights reserved.<br>
                This is an automated email. Please do not reply directly to this message.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
};

// Generate QR code as base64 data URL
const generateQRCodeBase64 = async (data: EmailData): Promise<string> => {
  const qrData = JSON.stringify({
    id: data.registrationId,
    fullName: data.fullName,
    guestName: data.guestName,
    email: data.email,
  });

  const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
    width: 400,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });

  return qrCodeDataUrl;
};

// Create nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host:  'smtp.gmail.com',
    port: 587,
    // parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    // process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// API Route Handler (App Router)
export async function POST(request: NextRequest) {
  try {
    const body: EmailData = await request.json();
    const { fullName, guestName, email, registrationId } = body;

    // Validate input
    if (!fullName || !guestName || !email || !registrationId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate QR code
    const qrCodeBase64 = await generateQRCodeBase64(body);

    // Get email HTML template
    const htmlContent = getEmailTemplate(body, qrCodeBase64);

    // Create transporter
    const transporter = createTransporter();

    // Email options
    const mailOptions = {
      from: `"Owambe Extravaganza" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: '🎉 Your Owambe Extravaganza Invitation - Registration Confirmed',
      html: htmlContent,
      text: `
Hello ${fullName}!

Congratulations! You have successfully registered for the Owambe Extravaganza.

EVENT DETAILS
Event: Owambe Extravaganza 2024
Date: Saturday, December 21, 2024
Time: 5:00 PM - 11:00 PM
Venue: Grand Ballroom, Lagos Continental Hotel
Dress Code: Traditional Attire / Smart Casual

YOUR REGISTRATION DETAILS
Name: ${fullName}
Guest Name: ${guestName}
Email: ${email}
Registration ID: ${registrationId}

IMPORTANT: Please present your QR code at the entrance for quick check-in.

We can't wait to celebrate with you!
See you there! 🎊

Contact: events@owambe.com | +234 801 234 5678
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.messageId);

    return NextResponse.json(
      { 
        success: true, 
        messageId: info.messageId,
        message: 'Email sent successfully' 
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Optional: Add GET handler for testing
export async function GET() {
  return NextResponse.json({ 
    message: 'Email API endpoint is working',
    endpoints: {
      POST: '/api/send-email - Send invitation email'
    }
  });
}