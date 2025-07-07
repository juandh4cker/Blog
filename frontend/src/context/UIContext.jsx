import {HeroUIProvider as HUIP} from '@heroui/react'

export const HeroUIProvider = ({ children }) => {
  return (
    <HUIP>
      {children}
    </HUIP>
  )
}