export const renderMap = (items, ComponentOrRenderFn, isComponent) => {
  if (typeof ComponentOrRenderFn === 'function') {
    const isReactComponent =
      ComponentOrRenderFn.prototype?.isReactComponent ||
      ComponentOrRenderFn.displayName ||
      ComponentOrRenderFn.name ||
      isComponent;

    if (isReactComponent) {
      return items.map((item) =>
        item.condition === false ? null : (
          <ComponentOrRenderFn key={item.key} {...item.props}>
            {item.children}
          </ComponentOrRenderFn>
        ),
      );
    } else {
      return items.map((item) => (item.condition === false ? null : ComponentOrRenderFn(item)));
    }
  }
  throw new Error('Second argument must be a React component or render function');
};
