import { useState } from 'react';

import { Button, Modal } from '@/components';

import * as icons from '@/assets/icons';
import { QR } from '@/utils';

const shareMessage = 'Mira esto en WorldBlog! ';

const shareOptions = [
  {
    name: 'WhatsApp',
    icon: icons.Whatsapp,
    url: (shareUrl) => `https://wa.me/?text=${shareMessage}${shareUrl}`,
    color: 'bg-[#25D366]',
  },
  {
    name: 'X',
    icon: icons.X,
    url: (shareUrl) => `https://x.com/intent/post?url=${shareMessage}${shareUrl}`,
    color: 'bg-gray-300',
  },
  {
    name: 'Telegram',
    icon: icons.Telegram,
    url: (shareUrl) => `https://t.me/share/url?url=${shareMessage}${shareUrl}`,
    color: 'bg-[#0088cc]',
  },
  {
    name: 'Email',
    icon: icons.Email,
    url: (shareUrl) => `mailto:?subject=${shareMessage}&body=${shareUrl}`,
    color: 'bg-gray-300',
  },
  {
    name: 'Facebook',
    icon: icons.Facebook,
    url: (shareUrl) => `https://www.facebook.com`,
    color: 'bg-[#1877F2]',
  },
  {
    name: 'Instagram',
    icon: icons.Instagram,
    url: (shareUrl) => `https://www.instagram.com`,
    color: 'bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5]',
  },
];

const handleShare = ({ shareUrl, optionUrl }) => {
  navigator.clipboard.writeText(`${shareMessage}${shareUrl}`);
  window.open(optionUrl(encodeURIComponent(shareUrl)), '_blank');
};

const Share = ({ shareUrl, setOnOpen }) => {
  const [onOpenQR, setOnOpenQR] = useState(false);
  const qr = QR(shareUrl);

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qr;
    link.download = 'qr-code.png';
    link.click();
  };

  const copyQR = async () => {
    const res = await fetch(qr);
    const blob = await res.blob();
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
    alert('QR copiado al portapapeles ✅');
  };

  return (
    <>
      <Modal setOnOpen={setOnOpen} isDivided backdrop="blur">
        <Modal.Header>{'Compartir'}</Modal.Header>

        <Modal.Body className="flex flex-row justify-between">
          {shareOptions.map((option) => (
            <Button.Tooltip content={option.name} className={option.color} key={option.name}>
              <Button
                kind="icon"
                onClick={() => handleShare({ shareUrl, optionUrl: option.url })}
                className={option.color}
              >
                <img src={option.icon} alt={option.name} width={24} height={24} />
              </Button>
            </Button.Tooltip>
          ))}
        </Modal.Body>

        <Modal.Footer>
          <Button kind="share" className={'w-full'}>
            {shareUrl}
          </Button>
          <Button kind="icon" onClick={onOpenQR}>
            <img src={icons.QR} alt={'QR'} width={24} height={24} />
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal setOnOpen={setOnOpenQR} backdrop="blur">
        <Modal.Header>{'Código QR'}</Modal.Header>
        <Modal.Body className="flex justify-center">
          <img src={qr} alt="QR" />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={copyQR} className="w-1/3">
            Copiar
          </Button>
          <Button onClick={downloadQR} className="w-1/3">
            Descargar
          </Button>
          <Modal.CloseButton className="w-1/3">Cerrar</Modal.CloseButton>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Share;
