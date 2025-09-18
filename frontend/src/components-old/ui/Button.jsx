import { 
  Button as HeroButton,
  Dropdown as HeroDropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Snippet,
  Switch,
  Tooltip
} from '@heroui/react';

const baseProps = {
  spinnerPlacement: 'end'
}

const variants = {
  base: {
    color: 'primary',
    variant: 'solid',
    size: 'sm'
  },
  submitForm: {
    color: 'primary',
    variant: 'solid',
    size: 'md',
    fullWidth: true
  },
  secondForm: {
    color: 'primary',
    variant: 'faded',
    size: 'md',
    fullWidth: true
  },
  danger: {
    color: 'danger',
    variant: 'ghost',
    size: 'sm',
    fullWidth: true
  },
}

const ShareButton = ({ children, ...props }) => {
  return (
    <Snippet 
      symbol='🔗'
      color='primary'
      variant="bordered"
      classNames={{
        pre: "text-tiny font-normal whitespace-nowrap font-sans p-0 leading-none",
      }}
      {...props}
    >
      {children}
    </Snippet>
  );
};

const IconButton = ({ tooltip, children, ...props }) => {
  const button = (
    <HeroButton 
      isIconOnly
      {...props}
    >
      {children}
    </HeroButton>
  );

  return tooltip ? <Tooltip content={tooltip}>{button}</Tooltip> : button;
};
  
const Dropdown = ({ children, items, triggerContent, triggerProps, menuProps, ...props }) => {
  return (
    <HeroDropdown {...props}>
      <DropdownTrigger>
        <HeroButton {...triggerProps}>{triggerContent}</HeroButton>
      </DropdownTrigger>
      <DropdownMenu items={items} {...menuProps}>
        {items
          ? (item) =>
              item.condition === false ? null : (
                <DropdownItem key={item.key} onAction={item.onClick} {...item.props}>
                  {item.text}
                </DropdownItem>
              )
          : children}
      </DropdownMenu>
    </HeroDropdown>
  )
}

const Button = ({
  children,
  variant='base',
  heroVariant,
  onClick,
  onPress,
  isLoading,
  loadingText,
  className,
  ...props

}) => {
  const variantProps = variants[variant] || {};
  const allProps = {...baseProps, ...variantProps, ...props};
  
  if (variant === 'share') {
    return <ShareButton className={className} {...allProps}>{children}</ShareButton>
  }

  if (variant === 'icon') {
    return <IconButton className={className} variant={heroVariant} onPress={onClick} {...allProps}>{children}</IconButton>
  }

  if (variant === 'switch') {
    return <Switch className={className} variant={heroVariant} {...props}>{children}</Switch>
  }
  
  if (variant === 'dropdown') {
    return <Dropdown className={className} variant={heroVariant} {...props}>{children}</Dropdown>
  }

  return (
    <HeroButton onPress={onPress || onClick} isLoading={isLoading} className={className} variant={heroVariant} {...allProps}>
      {isLoading ? (loadingText ? loadingText : children) : children}
    </HeroButton>
  );
};

export default Button;