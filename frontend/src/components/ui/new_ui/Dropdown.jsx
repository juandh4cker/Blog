import { 
  Dropdown as HeroDropdown,
  DropdownTrigger as HeroDropdownTrigger,
  DropdownMenu as HeroDropdownMenu,
  DropdownSection as HeroDropdownSection,
  DropdownItem as HeroDropdownItem,
} from '@heroui/react';

import KindsManager from './KindsManager';

const baseProps = {};

const kingdoms = {
  dropdown: {
    component: (props) => <HeroDropdown {...props}>{props.children}</HeroDropdown>,
    kingdomProps: {},
  },
  trigger: {
    component: (props) => <HeroDropdownTrigger {...props}>{props.children}</HeroDropdownTrigger>,
    kingdomProps: {},
  },
  menu: {
    component: (props) => <HeroDropdownMenu {...props}>{props.children}</HeroDropdownMenu>,
    kingdomProps: {},
  },
  section: {
    component: (props) => <HeroDropdownSection {...props}>{props.children}</HeroDropdownSection>,
    kingdomProps: {},
  },
  item: {
    component: (props) => <HeroDropdownItem {...props}>{props.children}</HeroDropdownItem>,
    kingdomProps: {},
  },
};

const kinds = {
  dropdown: {
    kingdom: 'dropdown',
    props: {},
  },
  trigger: {
    kingdom: 'trigger',
    props: {},
  },
  menu: {
    kingdom: 'menu',
    props: {},
  },
  section: {
    kingdom: 'section',
    props: {},
  },
};

const defaultKind = 'dropdown';

const Dropdown = ({
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

export default Dropdown;

Dropdown.Trigger = ({ children, kind, ...props }) => {
  const defaultKingdom = 'trigger'

  const allProps = {
    ...props
  }
  
  return <KindsManager
    baseProps={baseProps}
    kingdom={kingdoms[defaultKingdom]}
    kinds={tooltipKinds}
    kind={kind}
    defaultKind={defaultKingdom}
    {...allProps}
  >
    {children}
  </KindsManager>
};

Dropdown.Menu = ({ children, kind, ...props }) => {
  const defaultKingdom = 'menu'

  const allProps = {
    ...props
  }
  
  return <KindsManager
    baseProps={baseProps}
    kingdom={kingdoms[defaultKingdom]}
    kinds={tooltipKinds}
    kind={kind}
    defaultKind={defaultKingdom}
    {...allProps}
  >
    {children}
  </KindsManager>
};

Dropdown.Section = ({ children, kind, ...props }) => {
  const defaultKingdom = 'section'

  const allProps = {
    ...props
  }
  
  return <KindsManager
    baseProps={baseProps}
    kingdom={kingdoms[defaultKingdom]}
    kinds={tooltipKinds}
    kind={kind}
    defaultKind={defaultKingdom}
    {...allProps}
  >
    {children}
  </KindsManager>
};

const DropdownItemKinds = {
  item: {
    kingdom: 'item',
    props: {},
  },
  danger: {
    kingdom: 'item',
    props: {
      className: 'text-danger',
      color: 'danger',
    },
  },
};

const DropdownItemDefaultKind = 'item';

Dropdown.Item = ({ children, kind, ...props }) => {
  const allProps = {
    ...props
  };
  
  return <KindsManager
    baseProps={baseProps}
    kingdom={kingdoms[DropdownItemDefaultKind]}
    kinds={DropdownItemKinds}
    kind={kind}
    defaultKind={DropdownItemDefaultKind}
    {...allProps}
  >
    {children}
  </KindsManager>
};
