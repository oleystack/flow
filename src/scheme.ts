export type Constructor = new (...args: any[]) => any
export type GetPrimitive<C extends Constructor> = C extends (
  ...args: any[]
) => infer T
  ? T
  : C extends new (...args: any[]) => infer T
  ? T
  : never

export type Transformation<In, Out> = (value: In) => Promise<Out> | Out
export type Pipe<In, Out> = [
  ...Transformation<unknown, unknown>[],
  Transformation<unknown, In>,
  Transformation<In, Out>
]

type FieldGetter<C extends Constructor> = () => {
  __flow_type__: C
}

type GetParent<C extends Constructor, Creators> = Extract<
  Creators,
  Creator<C, any>
> extends Creator<C, infer ParentApi>
  ? ParentApi
  : never

type Creator<C1 extends Constructor, Api extends Record<string, any>> = (
  fields: <C2 extends Constructor>(
    constructor: C2,
    pipe: Pipe<GetPrimitive<C1>, GetPrimitive<C2>>
  ) => FieldGetter<C2>,
  pipe: Pipe<unknown, GetPrimitive<C1>>
) => Api

type Entry<C extends Constructor, Api extends Record<string, any>> = [
  C,
  Creator<GetPrimitive<C>, Api>
]

type BindCreatorApiArray<
  C extends Constructor,
  Api extends Array<any>,
  Creators
> = Api extends [infer A, ...infer Rest]
  ? [BindCreatorApi<C, A, Creators>, ...BindCreatorApiArray<C, Rest, Creators>]
  : []

type CreatorTransformer<C1 extends Constructor, Creators> = {
  transform: <C2 extends Constructor>(
    constructor: C2,
    transformation: Transformation<GetPrimitive<C1>, GetPrimitive<C2>>
  ) => Extract<Creators, Creator<C2, any>> extends Creator<C2, infer Api2>
    ? BindCreatorApi<C2, Api2, Creators> & CreatorTransformer<C2, Creators>
    : {}
}

type BindCreatorApi<C1 extends Constructor, Api, Creators> =
  // 1. Check if Api is a Creator
  Api extends FieldGetter<infer C2>
    ? Extract<Creators, Creator<C2, any>> extends Creator<infer C3, infer Api3>
      ? BindCreatorApi<C3, Api3, Creators> & CreatorTransformer<C3, Creators>
      : never
    : // 2. Check if Api is a function
    Api extends (...params: infer Params) => infer Result
    ? (...params: Params) => BindCreatorApi<C1, Result, Creators>
    : // 3. Check if Api is an object
    Api extends Record<string, any>
    ? { [K in keyof Api]: BindCreatorApi<C1, Api[K], Creators> }
    : // 4. Check if Api is an array
    Api extends Array<any>
    ? BindCreatorApiArray<C1, Api, Creators>
    : // 5. Otherwise return as it is
      Api

const extendScheme = <Entries extends Entry<any, any>>(entries: Entries[]) => {
  const fields = new Map<any, Creator<any, any>>(entries)

  type Creators = Entries extends Entry<infer C, infer Api>
    ? Creator<C, Api>
    : never

  type BindApi<C extends Constructor, Creators> = Extract<
    Creators,
    Creator<C, any>
  > extends Creator<C, infer Api>
    ? BindCreatorApi<C, Api, Creators> & CreatorTransformer<C, Creators>
    : BindCreatorApi<C, {}, Creators> & CreatorTransformer<C, Creators>

  const getField = <C1 extends Constructor>(
    constructor: C1,
    pipe = [] as unknown as Pipe<unknown, GetPrimitive<C1>>
  ): BindApi<C1, Creators> => {
    const transform = <C2 extends Constructor>(
      constructor: C2,
      transformation: Transformation<GetPrimitive<C1>, GetPrimitive<C2>>
    ) => {
      return {
        transform,
        ...(fields.get(constructor)?.(
          getField as any,
          [...pipe, transformation] as any
        ) ?? {})
      }
    }

    return {
      transform,
      ...(fields.get(constructor)?.(getField as any, pipe) ?? {})
    }
  }

  return {
    getField,
    with: <C1 extends Constructor, Api extends Record<string, any>>(
      constructor: C1,
      apiCreator: (
        parent: Extract<Creators, Creator<C1, any>> extends never
          ? {}
          : GetParent<C1, Creators>,
        fields: <C2 extends Constructor>(
          constructor: C2,
          pipe: Pipe<GetPrimitive<C1>, GetPrimitive<C2>>
        ) => FieldGetter<C2>,
        pipe: Pipe<unknown, GetPrimitive<C1>>
      ) => Api
    ) => {
      const parent =
        fields.get(constructor)?.(
          getField as any,
          [] as unknown as Pipe<unknown, GetPrimitive<C1>>
        ) ?? {}

      const bindApiCreator: Creator<C1, Api> = (_fields, _pipe) =>
        apiCreator(parent, _fields, _pipe)

      fields.set(constructor, bindApiCreator)
      const newEntries = Array.from(fields)

      return extendScheme<Exclude<Entries, Entry<C1, any>> | Entry<C1, Api>>(
        newEntries
      )
    }
  }
}

export const createScheme = () => extendScheme([])
