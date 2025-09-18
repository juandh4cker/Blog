import { Button, Modal, Divider } from "./ui";

import * as icons from '@/assets/icons';

const shareMessage = 'Mira esto en WorldBlog! ';

const shareOptions = [
  {
    name: 'WhatsApp',
    icon: icons.Whatsapp,
    url: (shareUrl) => `https://wa.me/?text=${shareMessage}${shareUrl}`, 
    color: 'bg-[#25D366]'
  },
  {
    name: 'X',
    icon: icons.X,
    url: (shareUrl) => `https://x.com/intent/post?url=${shareMessage}${shareUrl}`, 
    color: 'bg-gray-300' 
  },
  {
    name: 'Telegram',
    icon: icons.Telegram,
    url: (shareUrl) => `https://t.me/share/url?url=${shareMessage}${shareUrl}`, 
    color: 'bg-[#0088cc]'
  },
  {
    name: 'Email',
    icon: icons.Email,
    url: (shareUrl) => `mailto:?subject=${shareMessage}&body=${shareUrl}`,
    color: 'bg-gray-300'
  },
  {
    name: 'Facebook',
    icon: icons.Facebook,
    url: (shareUrl) => `https://www.facebook.com`, 
    color: 'bg-[#1877F2]'
  },
  {
    name: 'Instagram',
    icon: icons.Instagram,
    url: (shareUrl) => `https://www.instagram.com`, 
    color: 'bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5]'
  },
];

const handleShare = ({ shareUrl, optionUrl }) => {
  navigator.clipboard.writeText(`${shareMessage}${shareUrl}`);
  window.open(optionUrl(encodeURIComponent(shareUrl)), '_blank');
};

const ShareModal = ({shareUrl, setOnOpen}) => {
  return (
    <Modal setOnOpen={setOnOpen} isDivided backdrop='blur'>
      <Modal.Header>
        Compartir
      </Modal.Header>

      <Modal.Body className="flex flex-row justify-between"> 
        {shareOptions.map(option => 
          <Button 
            variant="icon" tooltip={option.name} className={option.color} key={option.name}
            onClick={() => handleShare({ shareUrl, optionUrl: option.url })}
          >
            <img src={option.icon} alt={option.name} width={24} height={24}/>
          </Button>
        )}  
      </Modal.Body>

      <Modal.Footer>
        <Button variant="share" className={'w-full'}>{shareUrl}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShareModal;