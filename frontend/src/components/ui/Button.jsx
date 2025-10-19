import {
  Button as HeroButton,
  ButtonGroup as HeroButtonGroup,
  Snippet as HeroSnippet,
  Tooltip as HeroTooltip,
  Switch as HeroSwitch,
} from '@heroui/react';

import KindsManager from '../KindsManager';

const baseProps = {};

const kingdoms = {
  default: {
    component: (props) => <HeroButton {...props}>{props.children}</HeroButton>,
    kingdomProps: {},
  },
  button: {
    component: (props) => <HeroButton {...props}>{props.children}</HeroButton>,
    kingdomProps: {
      spinnerPlacement: 'end',
    },
  },
  icon: {
    component: (props) => <HeroButton {...props}>{props.children}</HeroButton>,
    kingdomProps: {
      isIconOnly: true,
    },
  },
  group: {
    component: (props) => <HeroButtonGroup {...props}>{props.children}</HeroButtonGroup>,
    kingdomProps: {},
  },
  snippet: {
    component: (props) => <HeroSnippet {...props}>{props.children}</HeroSnippet>,
    kingdomProps: {},
  },
  tooltip: {
    component: (props) => <HeroTooltip {...props}>{props.children}</HeroTooltip>,
    kingdomProps: {},
  },
  switch: {
    component: (props) => <HeroSwitch {...props}>{props.children}</HeroSwitch>,
    kingdomProps: {},
  },
};

const kinds = {
  default: {
    kingdom: 'default',
    props: {},
  },
  button: {
    kingdom: 'button',
    props: {
      color: 'primary',
      variant: 'solid',
      size: 'sm',
    },
  },
  primary: {
    kingdom: 'button',
    props: {
      color: 'primary',
      variant: 'solid',
      size: 'md',
      fullWidth: true,
    },
  },
  secondary: {
    kingdom: 'button',
    props: {
      color: 'primary',
      variant: 'faded',
      size: 'md',
      fullWidth: true,
    },
  },
  danger: {
    kingdom: 'button',
    props: {
      color: 'danger',
      variant: 'ghost',
      size: 'sm',
      fullWidth: true,
    },
  },
  icon: {
    kingdom: 'icon',
    props: {
      color: 'primary',
      variant: 'light',
    },
  },
  group: {
    kingdom: 'group',
    props: {},
  },
  snippet: {
    kingdom: 'snippet',
    props: {},
  },
  share: {
    kingdom: 'snippet',
    props: {
      symbol: '🔗',
      color: 'primary',
      variant: 'bordered',
      classNames: {
        pre: 'text-tiny font-normal whitespace-nowrap font-sans p-0 leading-none',
      },
    },
  },
  switch: {
    kingdom: 'switch',
    props: {},
  },
  tooltip: {
    kingdom: 'tooltip',
    props: {},
  },
};

const defaultKind = 'button';

const Button = ({ kind, children, ...props }) => {
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

export default Button;

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

Button.Group = createSub('group');
Button.Tooltip = createSub('tooltip');
