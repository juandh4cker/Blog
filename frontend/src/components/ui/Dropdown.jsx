import React from 'react';

import {
  Dropdown as HeroDropdown,
  DropdownTrigger as HeroDropdownTrigger,
  DropdownMenu as HeroDropdownMenu,
  DropdownSection as HeroDropdownSection,
  DropdownItem as HeroDropdownItem,
} from '@heroui/react';

import { renderMap } from '@/utils';

import KindsManager from '../KindsManager';

const baseProps = {};

const kingdoms = {
  default: {
    component: (props) => <HeroDropdown {...props}>{props.children}</HeroDropdown>,
    kingdomProps: {},
  },
  dropdown: {
    component: (props) => <BaseDropdown {...props}>{props.children}</BaseDropdown>,
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
  default: {
    kingdom: 'default',
    props: {},
  },
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

const isTrigger = (child) =>
  child?.type === kingdoms.trigger.component || child?.type === Dropdown.Trigger;

const isMenu = (child) => child?.type === kingdoms.menu.component || child?.type === Dropdown.Menu;

const BaseDropdown = ({ children, items, ...props }) => {
  const childArray = Array.isArray(children) ? children : [children];

  const trigger = childArray.find(isTrigger);
  const hasManualMenu = childArray.some(isMenu);

  const menuContent = childArray.filter((child) => !isTrigger(child) && !isMenu(child));

  if (items)
    return (
      <HeroDropdown {...props}>
        <HeroDropdownTrigger>{children}</HeroDropdownTrigger>
        <HeroDropdownMenu>{renderMap(items, HeroDropdownItem)}</HeroDropdownMenu>
      </HeroDropdown>
    );

  return (
    <HeroDropdown {...props}>
      {trigger}

      {!hasManualMenu && <HeroDropdownMenu>{menuContent}</HeroDropdownMenu>}
      {childArray.map((child, i) => (isMenu(child) ? React.cloneElement(child, { key: i }) : null))}
    </HeroDropdown>
  );
};

const Dropdown = ({ kind, children, ...props }) => {
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

export default Dropdown;

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

Dropdown.Trigger = createSub('trigger');
Dropdown.Menu = createSub('menu');
Dropdown.Section = createSub('section');

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

Dropdown.Item = HeroDropdownItem;

Dropdown.Item2 = ({ children, kind, ...props }) => {
  const allProps = {
    ...props,
  };

  return (
    <KindsManager
      baseProps={baseProps}
      kingdom={kingdoms[DropdownItemDefaultKind]}
      kinds={DropdownItemKinds}
      kind={kind}
      defaultKind={DropdownItemDefaultKind}
      {...allProps}
    >
      {children}
    </KindsManager>
  );
};
