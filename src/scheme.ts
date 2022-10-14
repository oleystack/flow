export type Constructor<T> = <Args>(...args: Args[]) => T
export type Transformation<In, Out> = (value: In) => Promise<Out> | Out
export type Pipe<T> = [...Transformation<any, any>[], Transformation<any, T>]

type FieldGetter<T> = () => {
  __flow_type__: T
}

type Fields = <T>(constructor: Constructor<T>, pipe: Pipe<T>) => FieldGetter<T>

type GetParent<T, Creators> = Extract<
  Creators,
  Creator<T, any>
> extends Creator<T, infer ParentApi>
  ? ParentApi
  : never

type Creator<T, Api extends Record<string, any>> = (
  fields: Fields,
  pipe: Pipe<T>
) => Api

type Entry<T, Api extends Record<string, any>> = [
  Constructor<T>,
  Creator<T, Api>
]

type BindCreatorApiArray<T, Api extends Array<any>, Creators> = Api extends [
  infer A,
  ...infer Rest
]
  ? [BindCreatorApi<T, A, Creators>, ...BindCreatorApiArray<T, Rest, Creators>]
  : []

type CreatorTransformer<In, Creators> = {
  transform: <Out>(
    constructor: Constructor<Out>,
    transformation: Transformation<In, Out>
  ) => Extract<Creators, Creator<Out, any>> extends Creator<Out, infer Api>
    ? BindCreatorApi<Out, Api, Creators> & CreatorTransformer<Out, Creators>
    : {}
}

type BindCreatorApi<T, Api, Creators> =
  // 1. Check if Api is a Creator
  Api extends FieldGetter<infer T2>
    ? Extract<Creators, Creator<T2, any>> extends Creator<infer T3, infer Api3>
      ? BindCreatorApi<T3, Api3, Creators> & CreatorTransformer<T3, Creators>
      : never
    : // 2. Check if Api is a function
    Api extends (...params: infer Params) => infer Result
    ? (...params: Params) => BindCreatorApi<T, Result, Creators>
    : // 3. Check if Api is an object
    Api extends Record<string, any>
    ? { [K in keyof Api]: BindCreatorApi<T, Api[K], Creators> }
    : // 4. Check if Api is an array
    Api extends Array<any>
    ? BindCreatorApiArray<T, Api, Creators>
    : // 5. Otherwise return as it is
      Api

const extendScheme = <Entries extends Entry<any, any>>(entries: Entries[]) => {
  const fields = new Map<Constructor<any>, Creator<any, any>>(entries)

  type Creators = Entries extends Entry<infer T, infer Api>
    ? Creator<T, Api>
    : never

  type BindApi<T, Creators> = Extract<
    Creators,
    Creator<T, any>
  > extends Creator<T, infer Api>
    ? BindCreatorApi<T, Api, Creators> & CreatorTransformer<T, Creators>
    : BindCreatorApi<T, {}, Creators> & CreatorTransformer<T, Creators>

  const getField = <T>(
    constructor: Constructor<T>,
    pipe: Pipe<T> = [] as unknown as Pipe<T>
  ): BindApi<T, Creators> => {
    const transform = <Out>(
      constructor: Constructor<Out>,
      transformation: Transformation<T, Out>
    ) => {
      return {
        transform,
        ...(fields.get(constructor)?.(getField as any, [
          ...pipe,
          transformation
        ]) ?? {})
      }
    }

    return {
      transform,
      ...(fields.get(constructor)?.(getField as any, pipe) ?? {})
    }
  }

  return {
    getField,
    with: <T, Api extends Record<string, any>>(
      constructor: Constructor<T>,
      apiCreator: (
        parent: Extract<Creators, Creator<T, any>> extends never
          ? {}
          : GetParent<T, Creators>,
        fields: Fields,
        pipe: Pipe<T>
      ) => Api
    ) => {
      const parent =
        fields.get(constructor)?.(getField as any, [] as unknown as Pipe<T>) ??
        {}

      const bindApiCreator: Creator<T, Api> = (_fields, _pipe) =>
        apiCreator(parent, _fields, _pipe)

      fields.set(constructor, bindApiCreator)
      const newEntries = Array.from(fields)

      return extendScheme<Exclude<Entries, Entry<T, any>> | Entry<T, Api>>(
        newEntries
      )
    }
  }
}

export const createScheme = () => extendScheme([])
