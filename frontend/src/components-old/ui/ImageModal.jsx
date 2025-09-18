import { Image, Modal } from "@/components/ui";

const ImageModal = ({ post, setOnOpen}) => {
  return (
    <Modal setOnOpen={setOnOpen} isDivided>
      <Modal.Header className="flex flex-row gap-1 items-end">
        <h4 className="font-bold text-2xl">{post.name}, </h4>
        <p className="font-medium">{post.location}</p>
      </Modal.Header>
      <Modal.Body className='flex items-center justify-center'>
        <Image 
          src={post.imageUrl}
          className="w-[80vw] object-contain rounded-lg shadow-lg"
        />
      </Modal.Body>
    </Modal>
  );
};

export default ImageModal