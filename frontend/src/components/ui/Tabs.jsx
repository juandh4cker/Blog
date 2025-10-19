import { Tabs as HeroTabs, Tab as HeroTab } from '@heroui/react';

import KindsManager from '../KindsManager';

const baseProps = {};

const kingdoms = {
  default: {
    component: (props) => <HeroTabs {...props}>{props.children}</HeroTabs>,
    kingdomProps: {},
  },
  tabs: {
    component: (props) => <HeroTabs {...props}>{props.children}</HeroTabs>,
    kingdomProps: {},
  },
  tab: {
    component: (props) => <HeroTab {...props}>{props.children}</HeroTab>,
    kingdomProps: {},
  },
};

const kinds = {
  default: {
    kingdom: 'default',
    props: {},
  },
  tabs: {
    kingdom: 'tabs',
    props: {
      size: 'lg',
      color: 'primary',
    },
  },
  tab: {
    kingdom: 'tab',
    props: {},
  },
};

const defaultKind = 'tabs';

const Tabs = ({ kind, children, ...props }) => {
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

export default Tabs;

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

Tabs.Tab = HeroTab;
