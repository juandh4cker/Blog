import { Spinner as HeroSpinner } from '@heroui/react';

import KindsManager from '../KindsManager';

const baseProps = {};

const kingdoms = {
  spinner: {
    component: (props) => <HeroSpinner {...props}>{props.children}</HeroSpinner>,
    kingdomProps: {},
  },
};

const kinds = {
  spinner: {
    kingdom: 'spinner',
    props: {},
  },
};

const defaultKind = 'spinner';

const Loading = ({ kind, children, ...props }) => {
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

export default Loading;
