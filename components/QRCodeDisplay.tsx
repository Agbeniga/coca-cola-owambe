import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import { FileImage, FileText, Check } from "lucide-react";

interface QRCodeDisplayProps {
  registrationId: string;
  // firstName: string;
  // lastName: string;
  fullName: string;
  guestName: string;
  email: string;
  onReset: () => void;
}

export function QRCodeDisplay({
  registrationId,
  // firstName,
  // lastName,
  fullName,
  guestName,
  email,
  onReset,
}: QRCodeDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    generateQRCode();
  }, [registrationId]);

  const generateQRCode = async () => {
    try {
      const qrData = `Full Name: ${fullName}\nGuest Name: ${guestName}`;
      
      // JSON.stringify({
      //   // id: registrationId,
      //   // firstName: firstName,
      //   // lastName: lastName,
      //   fullName: `${firstName} ${lastName}`,
      //   guestName: guestName,
      //   // email: email,
      // });

      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 120,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#00000000",
        },
      });

      setQrCodeImage(qrCodeDataUrl);
      drawOnContainer(qrCodeDataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const drawOnContainer = async (qrCode: string) => {
    if (!containerRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 600;
    canvas.height = 800;

    // Load the background image
    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous"; // Handle CORS if needed

    bgImg.onload = () => {
      // Draw the background image
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      // Load and draw the QR code on top
      const qrImg = new Image();
      qrImg.onload = () => {
        const qrSize = 120;
        const x = (canvas.width - qrSize) / 2;
        const y = (canvas.height - qrSize) / 2 + 70;
        ctx.drawImage(qrImg, x, y, qrSize, qrSize);
      };
      qrImg.src = qrCode;
    };

    bgImg.onerror = (error) => {
      console.error("Error loading background image:", error);
    };

    bgImg.src = "/Invite-without-QR.svg";
  };

  const exportAsImage = async () => {
    setIsExporting(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const link = document.createElement("a");
      link.download = `${fullName}-Coca-Cola-Owambe-event-invite.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error exporting image:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsPDF = async () => {
    setIsExporting(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [900, 1200],
      });

      pdf.addImage(imgData, "PNG", 0, 0, 900, 1200);
      pdf.save(`${fullName}-Coca-Cola-Owambe-event-invite.pdf`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
            <Check className="text-green-600" size={28} />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Registration Successful!
          </h2>
          <p className="mt-1 text-gray-600">Your invite is ready to download</p>
        </div>
      </div>

      <div className="p-8 bg-white rounded-lg shadow-md">
        <h3 className="mb-6 text-xl font-bold text-gray-800">
          Your Event Invite
        </h3>
        <div
          ref={containerRef}
          className="flex justify-center p-4 mb-6 rounded-lg bg-gray-50"
        >
          <canvas ref={canvasRef} className="h-auto max-w-full" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <button
            onClick={exportAsImage}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 bg-[#F40009] text-white py-4 px-6 rounded-lg font-semibold hover:bg-[#D00008] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileImage size={20} />
            {isExporting ? "Exporting..." : "Export as PNG"}
          </button>
          <button
            onClick={exportAsPDF}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 bg-[#F40009] text-white py-4 px-6 rounded-lg font-semibold hover:bg-[#D00008] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText size={20} />
            {isExporting ? "Exporting..." : "Export as PDF"}
          </button>
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full border-2 border-[#F40009] text-[#F40009] py-3 rounded-lg font-semibold hover:bg-[#F40009] hover:text-white transition"
      >
        Create Another Registration
      </button>
    </div>
  );
}
