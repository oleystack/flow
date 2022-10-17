export type Constructor = new (...args: any[]) => any
type GetPrimitive<C extends Constructor> = C extends (...args: any[]) => infer T
  ? T
  : C extends new (...args: any[]) => infer T
  ? T
  : never

export type Transformation<In, Out> = (value: In) => Promise<Out> | Out
export type Pipe<In, Out> = [
  ...Transformation<In, In>[], // never change anything here to any/unknown :)
  Transformation<In, Out>
]

type FieldGetter<C extends Constructor> = () => {
  __flow_type__: C
}

type FieldGetterFn<
  C1 extends Constructor,
  Resource
> = Resource extends undefined
  ? <C2 extends Constructor>(
      constructor: C2,
      pipe: Pipe<GetPrimitive<C1>, GetPrimitive<C2>>
    ) => FieldGetter<C2>
  : <C2 extends Constructor>(
      constructor: C2,
      pipe: Pipe<GetPrimitive<C1>, GetPrimitive<C2>>,
      resource: Resource
    ) => FieldGetter<C2>

type GetParentApi<C extends Constructor, Creators> = Extract<
  Creators,
  Creator<C, any, any>
> extends Creator<C, infer ParentApi, any>
  ? ParentApi
  : never

type Creator<
  C1 extends Constructor,
  Api extends Record<string, any>,
  Resource
> = (
  fields: FieldGetterFn<C1, Resource>,
  pipe: Pipe<any, GetPrimitive<C1>>,
  resource: Resource
) => Api

type Entry<C extends Constructor, Api extends Record<string, any>> = [
  C,
  Creator<GetPrimitive<C>, Api, any>
]

export type GetResourceType<Field extends CommonCreator<any, any, any, any>> =
  Field extends CommonCreator<any, any, infer Resource, any> ? Resource : never

type BindCreatorApiArray<
  C extends Constructor,
  Api extends Array<any>,
  Creators,
  Resource,
  Omitted extends string | number | symbol
> = Api extends [infer A, ...infer Rest]
  ? [
      BindCreatorApi<C, A, Creators, Resource, Omitted>,
      ...BindCreatorApiArray<C, Rest, Creators, Resource, Omitted>
    ]
  : []

type BindApi<
  C extends Constructor,
  Creators,
  Resource,
  Omitted extends string | number | symbol
> = Extract<Creators, Creator<C, any, any>> extends Creator<C, infer Api, any>
  ? Omit<
      BindCreatorApi<C, Api, Creators, Resource, Omitted> &
        CommonCreator<C, Creators, Resource, Omitted>,
      Omitted
    >
  : Omit<CommonCreator<C, Creators, Resource, Omitted>, Omitted>

type CommonCreator<
  C1 extends Constructor,
  Creators,
  Resource,
  Omitted extends string | number | symbol
> = {
  transform<C2 extends Constructor>(
    constructor: C2,
    transformation: Transformation<GetPrimitive<C1>, GetPrimitive<C2>>
  ): BindApi<C2, Creators, Resource, Omitted>

  transform(
    transformation: Transformation<GetPrimitive<C1>, GetPrimitive<C1>>
  ): BindApi<C1, Creators, Resource, Omitted>

  getResource(): Resource

  hide<
    ToOmit extends keyof BindApi<C1, Creators, Resource, Omitted> = never
  >(): BindApi<C1, Creators, Resource, Omitted | ToOmit>

  expose<ToExpose extends Omitted>(): BindApi<
    C1,
    Creators,
    Resource,
    Exclude<Omitted, ToExpose>
  >
}

type BindCreatorApi<
  C1 extends Constructor,
  Api,
  Creators,
  Resource,
  Omitted extends string | number | symbol
> =
  // 1. Check if Api is a Creator
  Api extends FieldGetter<infer C2>
    ? BindApi<C2, Creators, Resource, Omitted>
    : // 2. Check if Api is a function
    Api extends (...params: infer Params) => infer Result
    ? (
        ...params: Params
      ) => BindCreatorApi<C1, Result, Creators, Resource, Omitted>
    : // 3. Check if Api is an object
    Api extends Record<string, any>
    ? {
        [K in keyof Api]: BindCreatorApi<
          C1,
          Api[K],
          Creators,
          Resource,
          Omitted
        >
      }
    : // 4. Check if Api is an array
    Api extends Array<any>
    ? BindCreatorApiArray<C1, Api, Creators, Resource, Omitted>
    : // 5. Otherwise return as it is
      Api

const extendScheme = <Entries extends Entry<any, any>, Resource>(
  entries: Entries[]
) => {
  const fields = new Map<any, Creator<any, any, Resource>>(entries)

  type Creators = Entries extends Entry<infer C, infer Api>
    ? Creator<C, Api, Resource>
    : never

  type FieldBinder = Resource extends undefined
    ? <
        C1 extends Constructor,
        FieldResource extends Resource = Resource,
        Omitted extends string | number | symbol = ''
      >(
        constructor: C1,
        pipe?: Pipe<any, GetPrimitive<C1>> | []
      ) => BindApi<C1, Creators, FieldResource, Omitted>
    : <
        C1 extends Constructor,
        FieldResource extends Resource = Resource,
        Omitted extends string | number | symbol = ''
      >(
        constructor: C1,
        pipe: Pipe<any, GetPrimitive<C1>> | [],
        resource: FieldResource
      ) => BindApi<C1, Creators, FieldResource, Omitted>

  /**
   * Field binder
   * @param constructor
   * @param pipe
   * @returns API
   */
  const getField = <
    C1 extends Constructor,
    FieldResource extends Resource,
    Omitted extends string | number | symbol
  >(
    constructor: C1,
    pipe: Pipe<any, GetPrimitive<C1>> | [] = [],
    resource = undefined as FieldResource
  ): BindApi<C1, Creators, FieldResource, Omitted> => {
    /**
     * Main transform function
     * @param constructorOrTransformation
     * @param transformation
     * @returns field API
     */
    const transform = <C2 extends Constructor>(
      constructorOrTransformation:
        | C2
        | Transformation<GetPrimitive<C1>, GetPrimitive<C1>>,
      transformation?: Transformation<GetPrimitive<C1>, GetPrimitive<C2>>
    ) => {
      const hasConstructor = transformation !== undefined

      const thisConstructor = hasConstructor
        ? (constructorOrTransformation as C2)
        : constructor

      const thisTransformation = hasConstructor
        ? transformation
        : (constructorOrTransformation as Transformation<
            GetPrimitive<C1>,
            GetPrimitive<C1>
          >)

      return getField(thisConstructor, [...pipe, thisTransformation], resource)
    }

    return new Proxy(
      {
        ...fields.get(constructor)?.(
          getField as any,
          pipe as Pipe<any, GetPrimitive<C1>>,
          resource
        )
      },
      {
        get: (target, prop) => {
          if (['hide', 'expose'].includes(prop as string)) {
            return () => getField(constructor, pipe, resource)
          }

          if (prop === 'getResource') {
            return () => resource
          }

          if (prop === 'transform') {
            return transform
          }

          return target[prop]
        }
      }
    )
  }

  /**
   * Field adder
   * @param constructor
   * @param apiCreator (parent, fields, pipe) => api
   * @returns extended scheme
   */
  const addField = <C1 extends Constructor, Api extends Record<string, any>>(
    constructor: C1,
    apiCreator: (
      getParent: Extract<Creators, Creator<C1, any, any>> extends never
        ? {}
        : GetParentApi<C1, Creators>,
      fields: FieldGetterFn<C1, Resource>,
      pipe: Pipe<any, GetPrimitive<C1>>,
      resource: Resource
    ) => Api
  ) => {
    // Closes parent creator
    const parentCreator = fields.get(constructor)?.bind({})

    const getParent = (pipe: Pipe<any, GetPrimitive<C1>>, resource: Resource) =>
      parentCreator?.(getField as any, pipe, resource) ?? {}

    const bindApiCreator: Creator<C1, Api, Resource> = (
      _fields,
      _pipe,
      _resource
    ) => apiCreator(getParent(_pipe, _resource), _fields, _pipe, _resource)

    fields.set(constructor, bindApiCreator)
    const newEntries = Array.from(fields)

    return extendScheme<
      Exclude<Entries, Entry<C1, any>> | Entry<C1, Api>,
      Resource
    >(newEntries)
  }

  // expose extendScheme's API
  return {
    getField: getField as FieldBinder,
    with: addField
  }
}

export const createScheme = <Resource = undefined>() =>
  extendScheme<never, Resource>([])
