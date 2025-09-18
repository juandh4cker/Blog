import { useEffect, useState } from "react";
import QRCode from "qrcode";

export const QR = (url, size = 300) => {
  const [qr, setQr] = useState("");

  useEffect(() => {
    if (!url) return;
    const generateQR = async () => {
      try {
        const qrDataUrl = await QRCode.toDataURL(url, { width: size });
        setQr(qrDataUrl);
      } catch (err) {
        console.error("Error generando QR:", err);
      }
    };
    generateQR();
  }, [url, size]);

  return qr;
};
