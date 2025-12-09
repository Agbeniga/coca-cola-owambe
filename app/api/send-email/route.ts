import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import QRCode from "qrcode";
import sharp from "sharp";
import { readFile, access } from "fs/promises";
import { constants } from "fs";
import path from "path";

interface EmailData {
  fullName: string;
  guestName: string;
  email: string;
  registrationId: string;
}

// Generate the full invite image with QR code overlay
const generateInviteImageBuffer = async (data: EmailData): Promise<Buffer> => {
  try {
    // Generate QR code as buffer
    const qrData = `Full Name: ${data.fullName}\nGuest Name: ${data.guestName}`;

    const qrCodeBuffer = await QRCode.toBuffer(qrData, {
      width: 120,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      type: "png",
    });

    // Try PNG first, fallback to SVG
    let backgroundPath = path.join(
      process.cwd(),
      "public",
      "Invite-without-QR.png"
    );

    try {
      await access(backgroundPath, constants.F_OK);
    } catch {
      // If PNG doesn't exist, use SVG
      backgroundPath = path.join(
        process.cwd(),
        "public",
        "Invite-without-QR.svg"
      );
    }

    const backgroundBuffer = await readFile(backgroundPath);

    // Process background image
    let bgPngBuffer: Buffer;

    if (backgroundPath.endsWith(".svg")) {
      // For SVG, add explicit dimensions
      const svgString = backgroundBuffer.toString();
      const modifiedSvg = svgString.replace(
        /<svg/,
        '<svg width="600" height="800"'
      );

      bgPngBuffer = await sharp(Buffer.from(modifiedSvg))
        .resize(600, 800, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .png()
        .toBuffer();
    } else {
      // For PNG/JPG
      bgPngBuffer = await sharp(backgroundBuffer)
        .resize(600, 800, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .png()
        .toBuffer();
    }

    // Calculate QR code position (centered, slightly below middle)
    const qrSize = 120;
    const x = Math.floor((600 - qrSize) / 2);
    const y = Math.floor((800 - qrSize) / 2 + 70);

    // Composite QR code on background
    const finalImage = await sharp(bgPngBuffer)
      .composite([
        {
          input: qrCodeBuffer,
          top: y,
          left: x,
        },
      ])
      .png()
      .toBuffer();

    return finalImage;
  } catch (error) {
    console.error("Error generating invite image:", error);
    throw error;
  }
};

// Email template HTML
const getEmailTemplate = (data: EmailData): string => {
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
              <!-- Coca-Cola Logo SVG (White) -->
             <div style="margin-bottom: 20px;">
                <img src="https://res.cloudinary.com/deairfyff/image/upload/v1765193553/Coca-cola/Coca_cola_logo_White_hdhumq.png" 
                     alt="Coca-Cola Logo" 
                     width="200" 
                     height="auto" 
                     style="display: block; margin: 0 auto; filter: brightness(0) invert(1);" />
              </div>
              
              <h1 style="color: #ffffff; margin: 15px 0 0 0; font-size: 32px; font-weight: bold; line-height: 1.2; text-transform: uppercase; letter-spacing: 2px;">
                Owambe Extravaganza
              </h1>
              
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 18px; opacity: 0.95;">
                🎉 You're Invited! 🎉
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 30px;">
              
              <h2 style="font-size: 24px; color: #333333; margin: 0 0 20px 0; font-weight: bold;">
                Hello ${data.guestName}!
              </h2>

              <p style="font-size: 16px; color: #555555; line-height: 1.6; margin: 0 0 15px 0;">
                Congratulations! You have been invited to the <strong>Coca-Cola Owambe Extravaganza</strong>.
              </p>
              
             

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f9f9f9; border-left: 4px solid #F40009; margin: 30px 0;">
                <tr>
                  <td style="padding: 20px;">
                  
                    
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      
                      <tr>
                        <td style="padding: 5px 0;">
                          <span style="font-weight: bold; color: #F40009; font-size: 15px;">Guest who invited you: </span>
                          <span style="color: #333333; font-size: 15px;"> ${
                            data.fullName
                          }</span>
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
                      🎫 Your Event Invitation
                    </h3>
                    <p style="color: #666666; font-size: 14px; margin: 0 0 20px 0; line-height: 1.5;">
                      Please present this invitation at the entrance for quick check-in:
                    </p>
                    
                    <img src="cid:invite" alt="Event Invitation with QR Code" width="100%" style="display: block; margin: 20px auto; max-width: 600px; height: auto; border: 2px solid #e0e0e0; border-radius: 8px;" />
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fff3cd; border-left: 4px solid #ffc107; margin: 20px 0;">
                <tr>
                  <td style="padding: 15px;">
                    <p style="margin: 0; font-size: 14px; color: #856404; line-height: 1.5;">
                      <strong>⚠️ Important:</strong> Please save this email or download the invitation. 
                      You will need to present it at the venue for entry. Ensure your phone is charged!
                    </p>
                  </td>
                </tr>
              </table>

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
             
              <p style="font-size: 12px; color: #999999; margin: 20px 0 0 0; line-height: 1.5;">
                 © ${new Date().getFullYear()} Owambe Extravaganza. All rights reserved.<br>
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

// Create nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
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
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate the full invite image with QR code
    const inviteImageBuffer = await generateInviteImageBuffer(body);

    // Get email HTML template
    const htmlContent = getEmailTemplate(body);

    // Create transporter
    const transporter = createTransporter();

    // Email options with embedded invite image
    const mailOptions = {
      from: `"Owambe Extravaganza" <${
        process.env.SMTP_FROM || process.env.SMTP_USER
      }>`,
      to: email,
      subject:
        "🎉 Your Owambe Extravaganza Invitation - Registration Confirmed",
      html: htmlContent,
      attachments: [
        {
          filename: `${fullName}-Invite.png`,
          content: inviteImageBuffer,
          cid: "invite", // Content-ID for embedding in HTML
        },
      ],
      text: `
Hello ${fullName}!

Congratulations! You have successfully registered for the Owambe Extravaganza.

YOUR REGISTRATION DETAILS
Name: ${fullName}
Guest Name: ${guestName}
Email: ${email}
Registration ID: ${registrationId}

IMPORTANT: Please present your invitation at the entrance for quick check-in.

We can't wait to celebrate with you!
See you there! 🎊

Contact: events@owambe.com | +234 801 234 5678
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", info.messageId);

    return NextResponse.json(
      {
        success: true,
        messageId: info.messageId,
        message: "Email sent successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Optional: Add GET handler for testing
export async function GET() {
  return NextResponse.json({
    message: "Email API endpoint is working",
    endpoints: {
      POST: "/api/send-email - Send invitation email",
    },
  });
}
