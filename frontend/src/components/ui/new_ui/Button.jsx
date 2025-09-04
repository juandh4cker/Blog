import {
  Button as HeroButton,
  Snippet as HeroSnippet,
  Tooltip as HeroTooltip
} from "@heroui/react";

import KindsManager from './KindsManager';

const baseProps = {};

const kingdoms = {
  default: {
    component: (props) => <HeroButton {...props}>{props.children}</HeroButton>,
    kingdomProps: {},
  },
  button: {
    component: (props) => <HeroButton {...props}>{props.children}</HeroButton>,
    kingdomProps: {
      spinnerPlacement: 'end'
    },
  },
  snippet: {
    component: (props) => <HeroSnippet {...props}>{props.children}</HeroSnippet>,
    kingdomProps: {},
  },
  tooltip: {
    component: (props) => <HeroTooltip {...props}>{props.children}</HeroTooltip>,
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
      size: 'sm'
    },
  },
  primary: {
    kingdom: 'button',
    props: {
      color: 'primary',
      variant: 'solid',
      size: 'md',
      fullWidth: true
    },
  },
  secondary: {
    kingdom: 'button',
    props: {
      color: 'primary',
      variant: 'faded',
      size: 'md',
      fullWidth: true
    },
  },
  danger: {
    kingdom: 'button',
    props: {
      color: 'danger',
      variant: 'ghost',
      size: 'sm',
      fullWidth: true
    },
  },
  snippet: {
    kingdom: 'snippet',
    props: {},
  },
  share: {
    kingdom: 'snippet',
    props: {
      symbol: "🔗",
      color: "primary",
      variant: "bordered",
      classNames: {
        pre: "text-tiny font-normal whitespace-nowrap font-sans p-0 leading-none",
      },
    },
  },
};

const defaultKind = 'button';

const Button = ({
  kind,
  children,
  ...props
}) => {
  const allProps = {
    ...props
  }
  
  return <KindsManager
    baseProps={baseProps}
    kingdoms={kingdoms}
    kinds={kinds}
    kind={kind}
    defaultKind={defaultKind}
    {...allProps}
  >
    {children}
  </KindsManager>
};

export default Button;

const tooltipKinds = {
  tooltip: {
    kingdom: 'tooltip',
    props: {
      className: 'bg-current',
    },
  },
};

const tooltipDefaultKind = 'tooltip';

Button.Tooltip = ({ children, kind, ...props }) => {
  const allProps = {
    ...props
  }
  
  return <KindsManager
    baseProps={baseProps}
    kingdom={kingdoms[tooltipDefaultKind]}
    kinds={tooltipKinds}
    kind={kind}
    defaultKind={tooltipDefaultKind}
    {...allProps}
  >
    {children}
  </KindsManager>
};