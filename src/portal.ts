import React, { useReducer } from 'react'
import { View, ViewProps } from 'react-native/types'
import { createContext, useContextSelector } from './context'

type Require<T, K extends keyof T> = {
  [P in keyof Omit<T, K>]: T[P]
} & { [P in K]-?: T[P] }

const DEFAULT_PORTAL_NAME = 'default'

interface GateProps<PortalName extends string> {
  name?: PortalName
  children: React.ReactNode
}

interface HostProps<PortalName> extends ViewProps {
  name?: PortalName
  children?: React.ReactNode
}

interface ProviderProps {
  children?: React.ReactNode
}

export function portal<PortalNames extends string>(
  ...portals: PortalNames[]
): {
  Provider: React.FC<ProviderProps>
  Gate: React.FC<Require<GateProps<PortalNames>, 'name'>>
  Host: React.FC<Require<HostProps<PortalNames>, 'name'>>
}

export function portal(): {
  Provider: React.FC<ProviderProps>
  Gate: React.FC<Omit<GateProps<never>, 'name'>>
  Host: React.FC<Omit<HostProps<never>, 'name'>>
}

export function portal(portals = [DEFAULT_PORTAL_NAME]) {
  type PortalName = typeof portals[number]

  type Portals<PortalName extends string> = {
    [key in PortalName]?: React.ReactNode[]
  }

  type PortalRecord = {
    name: string
    children: React.ReactNode
  }

  type DispatcherAction = {
    type: 'add' | 'remove'
    payload: PortalRecord
  }

  type PortalState = {
    portals: Portals<PortalName>
    dispatch: React.Dispatch<DispatcherAction>
  }

  const context = createContext<PortalState>({} as PortalState)

  const Provider: React.FC<ProviderProps> = ({ children }) => {
    const [portals, dispatch] = useReducer(
      (portals: Portals<PortalName>, action: DispatcherAction) => {
        switch (action.type) {
          case 'add':
            return {
              ...portals,
              // Add the new portal to the beginning of the array
              [action.payload.name]: [
                action.payload.children,
                ...(portals[action.payload.name] ?? [])
              ]
            }
          case 'remove': {
            const newPortals = {
              ...portals,
              [action.payload.name]: portals[action.payload.name]?.filter(
                (value) => value !== action.payload.children
              )
            }

            // Remove the portal name if there are no more portals (edge case)
            if (newPortals[action.payload.name]?.length === 0) {
              delete newPortals[action.payload.name]
            }

            return newPortals
          }
          default:
            return portals
        }
      },
      {} as Portals<PortalName>
    )

    return React.createElement(
      context.Provider,
      { value: { portals, dispatch } },
      children
    )
  }

  const Gate: React.FC<GateProps<PortalName>> = ({
    name = DEFAULT_PORTAL_NAME,
    children
  }) => {
    const dispatch = useContextSelector(context, (state) => state.dispatch)

    React.useEffect(() => {
      dispatch({
        type: 'add',
        payload: {
          name,
          children
        }
      })

      return () => {
        dispatch({
          type: 'remove',
          payload: {
            name,
            children
          }
        })
      }
    }, [name, children, dispatch])

    return null
  }

  const Host: React.FC<HostProps<PortalName>> = ({
    name = DEFAULT_PORTAL_NAME,
    children,
    ...props
  }) => {
    const portal = useContextSelector(
      context,
      (state) => state.portals[name]?.[0]
    )

    return React.createElement(View, props, portal ?? children)
  }

  Provider.displayName = 'BitAboutNativePortal.Provider'
  Gate.displayName = 'BitAboutNativePortal.Gate'
  Host.displayName = 'BitAboutNativePortal.Host'

  return { Provider, Gate, Host }
}
