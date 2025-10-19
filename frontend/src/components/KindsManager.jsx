import clsx from 'clsx';

const KindsManager = ({
  baseProps,
  kingdoms,
  kingdom,
  kinds,
  kind,
  defaultKind,
  children,
  ...props
}) => {
  const selectedKind = kinds[kind] || kinds[defaultKind];
  const selectedKingdom = kingdom || kingdoms[selectedKind.kingdom];

  const kindProps = selectedKind.props;
  const kingdomProps = selectedKingdom.kingdomProps;
  const Renderer = selectedKingdom.component;

  const allProps = {
    ...baseProps,
    ...kingdomProps,
    ...kindProps,
    ...props,
    className: clsx(
      !props.disableBaseClassName && baseProps?.className,
      !props.disableKingdomClassName && kingdomProps?.className,
      !props.disableKindClassName && kindProps?.className,
      props.className,
    ),
  };

  return <Renderer {...allProps}>{children}</Renderer>;
};

export default KindsManager;
