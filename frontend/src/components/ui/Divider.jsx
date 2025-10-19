import { Divider as HeroDivider } from '@heroui/react';

import KindsManager from '../KindsManager';

const baseProps = {};

const kingdoms = {
  default: {
    component: (props) => <HeroDivider {...props}>{props.children}</HeroDivider>,
    kingdomProps: {},
  },
  divider: {
    component: (props) => <BaseDivider {...props}>{props.children}</BaseDivider>,
    kingdomProps: {
      vertical: false,
    },
  },
};

const kinds = {
  default: {
    kingdom: 'default',
    props: {},
  },
  divider: {
    kingdom: 'divider',
    props: {},
  },
};

const defaultKind = 'divider';

const BaseDivider = ({ vertical, ...props }) => (
  <HeroDivider orientation={vertical ? 'vertical' : 'horizontal'} {...props} />
);

const Divider = ({ kind, children, ...props }) => {
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

export default Divider;
