"use client"
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { RegistrationForm } from "@/components/RegistrationForm";
import { sendInvitationEmail } from "@/lib/emailClient";
import { Registration, supabase } from "@/lib/supabase";
import { useState } from "react";


interface RegistrationData {
  id: string;
  fullName: string;
  guestName: string;
  email: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [registration, setRegistration] = useState<RegistrationData | null>(
    null
  );
  const [error, setError] = useState<string>("");

  const handleSubmit = async (formData: {
    fullName: string;
    guestName: string;
    email: string;
  }) => {
    setIsLoading(true);
    setError("");

    try {
      const qrCodeData = JSON.stringify({
        name: formData.fullName,
        guest: formData.guestName,
        email: formData.email,
      });

      const registrationData: Omit<Registration, "id" | "created_at"> = {
        full_name: formData.fullName,
        guest_name: formData.guestName,
        email: formData.email,
        qr_code_data: qrCodeData,
      };

      const { data, error: insertError } = await supabase
  .from("registrations")
  .insert([registrationData])
  .select()
  .single();

if (insertError) {
  throw insertError;
}

if (data) {
  // Sync to Google Sheets
  await syncToGoogleSheets(data);
  
  // Send email
  const emailSent = await sendInvitationEmail({
    fullName: formData.fullName,
    guestName: formData.guestName,
    email: formData.email,
    registrationId: data.id,
  });

  if (!emailSent) {
    console.warn('Email failed to send, but registration was successful');
  }

  setRegistration({
    id: data.id,
    fullName: formData.fullName,
    guestName: formData.guestName,
    email: formData.email,
  });
}
    } catch (err) {
      console.error("Error creating registration:", err);
      setError("Failed to create registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const syncToGoogleSheets = async (registrationData: Registration) => {
    try {
      const webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL;

      if (!webhookUrl) {
        console.warn("Google Sheets webhook URL not configured");
        return;
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        mode: "no-cors", // Required for Apps Script
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: registrationData.id,
          // first_name: registrationData.first_name,
          // last_name: registrationData.last_name,
          full_name: registrationData.full_name,
          guest_name: registrationData.guest_name,
          // phone_number: registrationData.phone_number || "",
          email: registrationData.email,
          created_at: registrationData.created_at,
        }),
      });

      // Note: With no-cors mode, we can't read the response
      console.log("Data sent to Google Sheets");
    } catch (err) {
      console.warn("Google Sheets sync error:", err);
    }
  };

  const sendInvitationEmailToUser = async (
    formData: {
      // firstName: string;
      // lastName: string;
      fullName: string;
      guestName: string;
      // phoneNumber: string;
      email: string;
    },
    registrationId: string
  ) => {
    try {
      // const fullName = `${formData.firstName} ${formData.lastName}`;

      // Send email with QR code
      const emailSent = await sendInvitationEmail({
        fullName: formData.fullName,
        guestName: formData.guestName,
        email: formData.email,
        registrationId: registrationId,
      });

      if (emailSent) {
        console.log("Invitation email sent successfully to:", formData.email);
      } else {
        console.warn("Failed to send invitation email");
      }
    } catch (err) {
      console.warn("Email sending error:", err);
    }
  };

  const handleReset = () => {
    setRegistration(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container px-4 py-12 mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <div className="flex flex-col items-center justify-center gap-3 mb-4">
              {/* <QrCode size={48} className="text-[#F40009]" /> */}
              <img
                src="/Coca-cola-logo.svg"
                className=" w-[300px] h-[150px] "
              />
              <h1 className="text-4xl font-bold text-gray-800 md:text-5xl">
                {"Owambe Extravaganza".toLocaleUpperCase()}
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              Register your guest and download your invite
            </p>
          </div>

          {error && (
            <div className="px-4 py-3 mb-6 text-red-700 border border-red-200 rounded-lg bg-red-50">
              {error}
            </div>
          )}

          {!registration ? (
            <div className="p-8 bg-white shadow-lg rounded-xl">
              <RegistrationForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
          ) : (
            <QRCodeDisplay
              registrationId={registration.id}
              // firstName={registration.firstName}
              // lastName={registration.lastName}
              fullName={registration.fullName}
              guestName={registration.guestName}
              email={registration.email}
              onReset={handleReset}
            />
          )}
        </div>
      </div>

      {/* <footer className="py-8 text-center text-gray-600">
        <p className="text-sm">Event Registration System</p>
      </footer> */}
    </div>
  );

}
