import { Tabs as HeroTabs, Tab as HeroTab } from '@heroui/react';

const Tab = ({ items, children, render, size, color, tabClassName, tabProps, ...props }) => {
  return (
    <HeroTabs items={items} size={size || "lg"} color={color || "primary"} {...props}>
      {(item) => (
        <HeroTab key={item.key} title={item.key} className={tabClassName} {...tabProps}>
          {render ? render(item) : item.component}
        </HeroTab>
      )}
    </HeroTabs>
  );
};

export default Tab;
