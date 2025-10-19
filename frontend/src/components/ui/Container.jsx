import React from 'react';

import {
  Card as HeroCard,
  CardHeader as HeroCardHeader,
  CardBody as HeroCardBody,
  CardFooter as HeroCardFooter,
  Divider as HeroDivider,
} from '@heroui/react';

import KindsManager from '../KindsManager';

const baseProps = {};

const kingdoms = {
  default: {
    component: (props) => <HeroCard {...props}>{props.children}</HeroCard>,
    kingdomProps: {},
  },
  card: {
    component: (props) => <BaseCard {...props}>{props.children}</BaseCard>,
    kingdomProps: {
      disableBody: false,
    },
  },
  header: {
    component: (props) => <HeroCardHeader {...props}>{props.children}</HeroCardHeader>,
    kingdomProps: {},
  },
  body: {
    component: (props) => <HeroCardBody {...props}>{props.children}</HeroCardBody>,
    kingdomProps: {},
  },
  footer: {
    component: (props) => <HeroCardFooter {...props}>{props.children}</HeroCardFooter>,
    kingdomProps: {},
  },
};

const kinds = {
  default: {
    kingdom: 'default',
    props: {},
  },
  background: {
    kingdom: 'card',
    props: {
      isBlurred: true,
      disableBody: true,
      shadow: 'lg',
      className:
        'relative z-[1] mx-auto bg-white/60 backdrop-blur-xs shadow-xl ring-4 ring-blue-100/30 p-6 flex flex-col items-center justify-between gap-4',
    },
  },
  card: {
    kingdom: 'card',
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
};

const defaultKind = 'card';

const isHeader = (child) =>
  child?.type === kingdoms.header.component || child?.type === Container.Header;

const isBody = (child) => child?.type === kingdoms.body.component || child?.type === Container.Body;

const isFooter = (child) =>
  child?.type === kingdoms.footer.component || child?.type === Container.Footer;

const BaseCard = ({ children, isDivided, disableBody, ...props }) => {
  const childArray = Array.isArray(children) ? children : [children];

  const header = childArray.find(isHeader);
  const footer = childArray.find(isFooter);
  const hasManualBody = childArray.some(isBody);

  const bodyContent = childArray.filter(
    (child) => !isHeader(child) && !isFooter(child) && !isBody(child),
  );

  return (
    <HeroCard {...props}>
      {header}
      {isDivided && header && <HeroDivider />}

      {!hasManualBody && !disableBody && <HeroCardBody>{bodyContent}</HeroCardBody>}
      {disableBody && bodyContent}
      {childArray.map((child, i) => (isBody(child) ? React.cloneElement(child, { key: i }) : null))}

      {isDivided && footer && <HeroDivider />}
      {footer}
    </HeroCard>
  );
};

const Container = ({ kind, children, ...props }) => {
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

export default Container;

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

Container.Header = createSub('header');
Container.Body = createSub('body');
Container.Footer = createSub('footer');
