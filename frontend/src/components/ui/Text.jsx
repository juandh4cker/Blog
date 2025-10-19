import { Link as HeroLink } from '@heroui/react';

import Container from './Container';

import KindsManager from '../KindsManager';

const baseProps = {
  className: 'text-center',
};

const kingdoms = {
  default: {
    component: (props) => <pre {...props}>{props.children}</pre>,
    kingdomProps: {},
  },
  text: {
    component: (props) => <p {...props}>{props.children}</p>,
    kingdomProps: {
      className: 'text-md text-black',
    },
  },
  title: {
    component: (props) => <Title {...props}>{props.children}</Title>,
    kingdomProps: {
      className: 'text-center text-4xl font-bold p-2',
    },
  },
  subtitle: {
    component: (props) => <h2 {...props}>{props.children}</h2>,
    kingdomProps: {
      className: 'text-base text-gray-600',
    },
  },
  link: {
    component: (props) => <HeroLink {...props}>{props.children}</HeroLink>,
    kingdomProps: {
      className: 'text-lg cursor-pointer',
    },
  },
};

const kinds = {
  default: {
    kingdom: 'default',
    props: {},
  },
  text: {
    kingdom: 'text',
    props: {},
  },
  title: {
    kingdom: 'title',
    props: {},
  },
  subtitle: {
    kingdom: 'subtitle',
    props: {},
  },
  link: {
    kingdom: 'link',
    props: {},
  },
};

const defaultKind = 'text';

const Title = ({ children, ...props }) => (
  <Container>
    <h1 {...props}>{children}</h1>
  </Container>
);

const Text = ({ kind, children, ...props }) => {
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

export default Text;
