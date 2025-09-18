import React from "react";
import {
  ButtonGroup,
  Card as HeroCard, 
  CardHeader, 
  CardBody, 
  CardFooter, Divider
} from "@heroui/react"
import clsx from 'clsx';

const isHeader = (child) =>
  child?.type === Card.Header || child?.type === Container.Header

const isFooter = (child) =>
  child?.type === Card.Footer || child?.type === Container.Footer

const isBody = (child) =>
  child?.type === Card.Body || child?.type === Container.Body

const Card = ({ children, isDivided, disableBody = false, ...props }) => {
  const childArray = Array.isArray(children) ? children : [children]

  const header = childArray.find(isHeader)
  const footer = childArray.find(isFooter)
  const hasManualBody = childArray.some(isBody)

  const bodyContent = childArray.filter(
    (child) => !isHeader(child) && !isFooter(child) && !isBody(child)
  )

  return (
    <HeroCard {...props}>
      {header}
      {isDivided && header && <Divider />}
      {!hasManualBody && !disableBody && <CardBody>{bodyContent}</CardBody>}

      {disableBody && bodyContent}

      {childArray.map(
        (child, i) => (isBody(child) ? React.cloneElement(child, { key: i }) : null)
      )}
      {isDivided && footer && <Divider />}
      {footer}
    </HeroCard>
  )
}

Card.Header = ({ children, ...props }) => (
  <CardHeader {...props}>{children}</CardHeader>
)

Card.Body = ({ children, ...props }) => (
  <CardBody {...props}>{children}</CardBody>
)

Card.Footer = ({ children, ...props }) => (
  <CardFooter {...props}>{children}</CardFooter>
)

const Container = ({
  children,
  heroVariant,
  variant,
  className,
  bodyClassName,
  ...props

}) => {
  if (variant === 'button') {
    return (
      <ButtonGroup className={className} variant={heroVariant} {...props}>{children}</ButtonGroup>
    )

  } else if (variant === 'background') {
    return (
      <Card isBlurred disableBody shadow="lg" className={clsx('relative z-[1] mx-auto bg-white/60 backdrop-blur-xs shadow-xl ring-4 ring-blue-100/30 p-6 flex flex-col items-center justify-between gap-4', className)} {...props} >
        {children}
      </Card>
    );

  } else {
    return (
      <Card {...props} className={className}>
        {children}
      </Card>
    )
  }
};

export default Container;

Container.Header = ({ children, ...props }) => (
  <CardHeader {...props}>{children}</CardHeader>
)

Container.Body = ({ children, ...props }) => (
  <CardBody {...props}>{children}</CardBody>
)

Container.Footer = ({ children, ...props }) => (
  <CardFooter {...props}>{children}</CardFooter>
)