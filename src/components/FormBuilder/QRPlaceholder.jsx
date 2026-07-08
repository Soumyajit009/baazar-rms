import { useEffect, useRef } from "react";
import QRCode from "qrcode";

export default function QRPlaceholder({ value }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    QRCode.toCanvas(canvasRef.current, value, {
      width: 160,
      margin: 1,
      errorCorrectionLevel: "H",
      color: { dark: "#0f172a", light: "#ffffff" },
    }).then(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const logo = new Image();
      logo.src = "/logo.svg";
      logo.onload = () => {
        const logoSize = canvas.width * 0.22;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(cx, cy, logoSize / 2 + 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.drawImage(logo, cx - logoSize / 2, cy - logoSize / 2, logoSize, logoSize);
      };
    }).catch((err) => console.error("QR generation failed:", err));
  }, [value]);

  return (
    <canvas
      id="rms-qr-canvas"
      ref={canvasRef}
      className="mx-auto rounded-lg border border-slate-200"
    />
  );
}