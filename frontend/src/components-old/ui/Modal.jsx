import React, { createContext, useContext, useEffect } from "react";
import {
  Modal as HeroModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Divider,
  useDisclosure
} from "@heroui/react";
import Button from "./Button";

const ModalContext = createContext({});

const isHeader = (child) => child?.type === Modal.Header;
const isFooter = (child) => child?.type === Modal.Footer;
const isBody = (child) => child?.type === Modal.Body;
const isCloseButton = (child) => child?.type === Modal.CloseButton;

const Modal = ({ setOnOpen, children, isDivided, disableBody = false, ...props }) => {
  const childArray = React.Children.toArray(children);
  const header = childArray.find(isHeader);
  const footer = childArray.find(isFooter);
  const hasManualBody = childArray.some(isBody);
  
  const bodyContent = childArray.filter(
    (child) => !isHeader(child) && !isFooter(child) && !isBody(child) && !isCloseButton(child)
  );

  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  useEffect(() => {
    if (setOnOpen) setOnOpen(() => onOpen);
  }, [onOpen, setOnOpen]);

  return (
    <HeroModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      motionProps={{
        initial: { y: -100, opacity: 0 },
        animate: {
          y: 0,
          opacity: 1,
          transition: { type: "spring", stiffness: 500, damping: 20 },
        },
        exit: {
          y: -50,
          opacity: 0,
          transition: { duration: 0.2, ease: "easeIn" },
        },
      }}
      {...props}
    >
      <ModalContent>
        {(onClose) => (
          <ModalContext.Provider value={{ onClose }}>
            <>
              {header}
              {isDivided && header && <Divider />}

              {!hasManualBody && !disableBody && <ModalBody>{bodyContent}</ModalBody>}
              {disableBody && bodyContent}

              {childArray.map((child, i) =>
                isBody(child)
                  ? React.cloneElement(child, { key: i })
                  : null
              )}

              {isDivided && footer && <Divider />}
              {footer}
            </>
          </ModalContext.Provider>
        )}
      </ModalContent>
    </HeroModal>
  );
};

Modal.Header = ({ className, children, ...props }) => (
  <ModalHeader className={className || "flex flex-col gap-1"} {...props}>
    {children}
  </ModalHeader>
);

Modal.Body = ({ className, children, ...props }) => (
  <ModalBody className={className} {...props}>
    {children}
  </ModalBody>
);

Modal.Footer = ({ className, children, ...props }) => (
  <ModalFooter className={className} {...props}>
    {children}
  </ModalFooter>
);

Modal.CloseButton = ({ children = "Cerrar", ...props }) => {
  const { onClose } = useContext(ModalContext);
  return (
    <Button variant='danger' onPress={onClose} {...props}>
      {children}
    </Button>
  );
};

export default Modal;