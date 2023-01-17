import * as React from 'react'

const isDev = process.env.NODE_ENV !== 'production'

const canUseDOM = (): boolean =>
  typeof window !== 'undefined' &&
  !!(window.document && window.document.createElement)

type StateSelector<State, SelectedState> = (
  state: Readonly<State>
) => SelectedState

type ContextVersion = number

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
/* istanbul ignore next */
function is(x: any, y: any) {
  return (
    (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y) // eslint-disable-line no-self-compare
  )
}

/* istanbul ignore next */
const isEqualObject: (x: any, y: any) => boolean =
  typeof Object.is === 'function' ? Object.is : is

// This is a copy of React's Context API, but with a few changes:
type Context<Value> = React.Context<Value> & {
  Provider: React.FC<React.ProviderProps<Value>>
  // We don't support Consumer API
  Consumer: never
}

type ContextValue<Value> = {
  /** Holds an actual value of React's context that will be propagated down for computations. */
  value: React.MutableRefObject<Value>

  /** A version field is used to sync a context value and consumers. */
  version: React.MutableRefObject<ContextVersion>
}

type ContextReducer<Value, SelectedValue> = React.Reducer<
  readonly [Value, SelectedValue],
  undefined | readonly [ContextVersion, Value]
>

/* istanbul ignore next */
const useIsomorphicLayoutEffect: typeof React.useEffect = canUseDOM()
  ? React.useLayoutEffect
  : React.useEffect

const createProvider = <Value>(
  Original: React.Provider<ContextValue<Value>>
) => {
  const Provider: React.FC<React.ProviderProps<Value>> = (props) => {
    // Holds an actual "props.value"
    const valueRef = React.useRef(props.value)

    // Used to sync context updates and avoid stale values, can be considered as render/effect counter of Provider.
    const versionRef = React.useRef(0)

    // A stable object, is used to avoid context updates via mutation of its values.
    const contextValue = React.useRef<ContextValue<Value>>()

    if (!contextValue.current) {
      contextValue.current = {
        value: valueRef,
        version: versionRef
      }
    }

    useIsomorphicLayoutEffect(() => {
      valueRef.current = props.value
      versionRef.current += 1
    }, [props.value])

    return React.createElement(
      Original,
      { value: contextValue.current },
      props.children
    )
  }

  /* istanbul ignore next */
  if (isDev) {
    Provider.displayName = 'BitAboutNativePortal.ContextProvider'
  }

  return Provider as unknown as React.Provider<ContextValue<Value>>
}

export const createContext = <Value>(defaultValue: Value): Context<Value> => {
  const context = React.createContext<ContextValue<Value>>({
    value: { current: defaultValue },
    version: { current: -1 }
  })

  context.Provider = createProvider<Value>(context.Provider)

  // We don't support Consumer API
  delete (context as unknown as Context<Value>).Consumer

  return context as unknown as Context<Value>
}

export function useContextSelector<Value, SelectedValue>(
  context: Context<Value>,
  selector: StateSelector<Value, SelectedValue>
): SelectedValue {
  const contextValue = React.useContext(
    context as unknown as Context<ContextValue<Value>>
  )

  const {
    value: { current: currentState },
    version: { current: currentVersion }
  } = contextValue

  if (isDev && currentVersion === -1) {
    console.warn(
      'The context hook must be used in component wrapped with its corresponding Provider'
    )
  }

  const currentSelectedState = selector(currentState)

  const [[, cachedSelectedState], dispatch] = React.useReducer<
    ContextReducer<Value, SelectedValue>
  >(
    (
      cached: readonly [
        Value /* contextValue */,
        SelectedValue /* selector(value) */
      ],
      payload:
        | undefined // undefined from render below
        | readonly [ContextVersion, Value] // from provider effect
    ): readonly [Value, SelectedValue] => {
      const update = [currentState, currentSelectedState] as const
      const doNotUpdate = cached

      // Update during component with hook rerender
      if (!payload) {
        return update
      }

      const [cachedState, cachedSelectedState] = cached
      const [nextVersion, nextState] = payload

      // Update from provider props
      if (nextVersion <= currentVersion) {
        if (isEqualObject(cachedSelectedState, currentSelectedState)) {
          return doNotUpdate
        }

        return update
      }

      // Update from state-hook update
      try {
        if (isEqualObject(cachedState, nextState)) {
          return doNotUpdate
        }

        const nextSelectedState = selector(nextState)

        if (isEqualObject(cachedSelectedState, nextSelectedState)) {
          return doNotUpdate
        }

        return [nextState, nextSelectedState] as const
      } catch (e) {
        // stale props or some other reason
      }

      /* istanbul ignore next */
      if (isDev) {
        console.warn('Library discovered stale props issue')
      }

      // Edge Case - Force update (create new array with old values)
      return [cachedState, cachedSelectedState] as const
    },
    [currentState, currentSelectedState] as const
  )

  // Update during component with hook rerender
  if (!isEqualObject(cachedSelectedState, currentSelectedState)) {
    // schedule re-render
    // this is safe because it's self contained
    dispatch(undefined)
  }

  return currentSelectedState
}
