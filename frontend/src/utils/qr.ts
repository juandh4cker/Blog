import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export const QR = (url: string, size: number = 300): string => {
  const [qr, setQr] = useState<string>('');

  useEffect(() => {
    if (!url) return;

    const generateQR = async (): Promise<void> => {
      try {
        const qrDataUrl = await QRCode.toDataURL(url, { width: size });
        setQr(qrDataUrl);
      } catch (err) {
        console.error('Error generando QR:', err);
      }
    };

    generateQR();
  }, [url, size]);

  return qr;
};
