export function InviteTemplate() {
  return (
    <svg
      width="800"
      height="600"
      viewBox="0 0 800 600"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-2xl"
    >
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#F40009', stopOpacity: 0.1 }} />
          <stop offset="100%" style={{ stopColor: '#F40009', stopOpacity: 0.05 }} />
        </linearGradient>
      </defs>

      <rect width="800" height="600" fill="white" />
      <rect width="800" height="600" fill="url(#bgGradient)" />

      <line x1="0" y1="150" x2="800" y2="150" stroke="#F40009" strokeWidth="8" />

      <text
        x="400"
        y="90"
        fontSize="56"
        fontWeight="bold"
        textAnchor="middle"
        fill="#F40009"
        fontFamily="Arial, sans-serif"
      >
        YOU ARE INVITED
      </text>

      <text
        x="400"
        y="220"
        fontSize="32"
        fontWeight="600"
        textAnchor="middle"
        fill="#333333"
        fontFamily="Arial, sans-serif"
      >
        EVENT
      </text>

      <text
        x="400"
        y="280"
        fontSize="18"
        textAnchor="middle"
        fill="#666666"
        fontFamily="Arial, sans-serif"
      >
        Scan the QR code to confirm your attendance
      </text>

      <rect x="50" y="350" width="700" height="1" fill="#E0E0E0" />

      <g id="qr-placeholder">
        <rect x="30" y="380" width="280" height="180" fill="#F5F5F5" stroke="#CCCCCC" strokeWidth="2" />
        <text
          x="170"
          y="475"
          fontSize="14"
          textAnchor="middle"
          fill="#999999"
          fontFamily="Arial, sans-serif"
        >
          QR Code
        </text>
      </g>

      <text
        x="400"
        y="420"
        fontSize="16"
        textAnchor="middle"
        fill="#333333"
        fontFamily="Arial, sans-serif"
      >
        Thank you for joining us!
      </text>

      <text
        x="400"
        y="460"
        fontSize="14"
        textAnchor="middle"
        fill="#999999"
        fontFamily="Arial, sans-serif"
      >
        Your unique QR code is displayed on the left
      </text>

      <text
        x="400"
        y="500"
        fontSize="12"
        textAnchor="middle"
        fill="#CCCCCC"
        fontFamily="Arial, sans-serif"
      >
        Event Registration System
      </text>
    </svg>
  );
}
