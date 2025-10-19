import React, { createContext, useContext, useEffect } from 'react';

import {
  Modal as HeroModal,
  ModalContent as HeroModalContent,
  ModalHeader as HeroModalHeader,
  ModalBody as HeroModalBody,
  ModalFooter as HeroModalFooter,
  Divider as HeroDivider,
  useDisclosure,
} from '@heroui/react';

import Button from './Button';
import KindsManager from '../KindsManager';

const baseProps = {};

const kingdoms = {
  default: {
    component: (props) => <HeroModal {...props}>{props.children}</HeroModal>,
    kingdomProps: {},
  },
  modal: {
    component: (props) => <BaseModal {...props}>{props.children}</BaseModal>,
    kingdomProps: {
      disableBody: false,
    },
  },
  header: {
    component: (props) => <HeroModalHeader {...props}>{props.children}</HeroModalHeader>,
    kingdomProps: {},
  },
  body: {
    component: (props) => <HeroModalBody {...props}>{props.children}</HeroModalBody>,
    kingdomProps: {},
  },
  footer: {
    component: (props) => <HeroModalFooter {...props}>{props.children}</HeroModalFooter>,
    kingdomProps: {},
  },
  closeButton: {
    component: (props) => <CloseButton {...props}>{props.children}</CloseButton>,
    kingdomProps: {
      children: 'Cerrar',
      kind: 'danger',
    },
  },
};

const kinds = {
  default: {
    kingdom: 'default',
    props: {},
  },
  modal: {
    kingdom: 'modal',
    props: {},
  },
  header: {
    kingdom: 'header',
    props: {},
  },
  body: {
    kingdom: 'body',
    props: {},
  },
  footer: {
    kingdom: 'footer',
    props: {},
  },
  closeButton: {
    kingdom: 'closeButton',
    props: {},
  },
};

const defaultKind = 'modal';

const CloseButton = ({ children, ...props }) => {
  const { onClose } = useContext(ModalContext);

  return (
    <Button onPress={onClose} {...props}>
      {children}
    </Button>
  );
};

const ModalContext = createContext({});

const isHeader = (child) =>
  child?.type === kingdoms.header.component || child?.type === Modal.Header;

const isBody = (child) => child?.type === kingdoms.body.component || child?.type === Modal.Body;

const isFooter = (child) =>
  child?.type === kingdoms.footer.component || child?.type === Modal.Footer;

const isCloseButton = (child) =>
  child?.type === kingdoms.closeButton.component || child?.type === Modal.CloseButton;

const BaseModal = ({ children, isDivided, disableBody, setOnOpen, className, ...props }) => {
  const childArray = Array.isArray(children) ? children : [children];

  const header = childArray.find(isHeader);
  const hasManualBody = childArray.some(isBody);
  const footer = childArray.find(isFooter);

  const bodyContent = childArray.filter(
    (child) => !isHeader(child) && !isFooter(child) && !isBody(child) && !isCloseButton(child),
  );

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
          transition: { type: 'spring', stiffness: 500, damping: 20 },
        },
        exit: {
          y: -50,
          opacity: 0,
          transition: { duration: 0.2, ease: 'easeIn' },
        },
      }}
      {...props}
    >
      <HeroModalContent>
        {(onClose) => (
          <ModalContext.Provider value={{ onClose }}>
            <>
              {header}
              {isDivided && header && <HeroDivider />}

              {!hasManualBody && !disableBody && <HeroModalBody>{bodyContent}</HeroModalBody>}
              {disableBody && bodyContent}

              {childArray.map((child, i) =>
                isBody(child) ? React.cloneElement(child, { key: i }) : null,
              )}

              {isDivided && footer && <HeroDivider />}
              {footer}
            </>
          </ModalContext.Provider>
        )}
      </HeroModalContent>
    </HeroModal>
  );
};

const Modal = ({ kind, children, ...props }) => {
  const allProps = {
    ...props,
  };

  return (
    <KindsManager
      baseProps={baseProps}
      kingdoms={kingdoms}
      kinds={kinds}
      kind={kind}
      defaultKind={defaultKind}
      {...allProps}
    >
      {children}
    </KindsManager>
  );
};

export default Modal;

const createSub =
  (defaultKingdom) =>
  ({ children, kind, ...props }) => (
    <KindsManager
      baseProps={baseProps}
      kingdom={kingdoms[defaultKingdom]}
      kinds={kinds}
      kind={kind}
      defaultKind={defaultKingdom}
      {...props}
    >
      {children}
    </KindsManager>
  );

Modal.Header = createSub('header');
Modal.Body = createSub('body');
Modal.Footer = createSub('footer');
Modal.CloseButton = createSub('closeButton');
