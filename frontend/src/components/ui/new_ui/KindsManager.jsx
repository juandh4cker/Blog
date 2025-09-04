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
    ...props
  }

  return <Renderer {...allProps}>{children}</Renderer>;
};

export default KindsManager;