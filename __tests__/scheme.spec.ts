import { createScheme } from '../src/scheme'

describe('Basic usage', () => {
  it('Can be created', () => {
    const scheme = createScheme()

    expect(scheme).toBeDefined()
    expect(scheme.getField).toBeDefined()
    expect(scheme.with).toBeDefined()
  })

  it('Can define field', () => {
    let scheme = createScheme()

    // Before declaration
    expect(scheme.getField(Number)).toEqual({
      transform: expect.any(Function),
      getResource: expect.any(Function)
    })

    scheme = scheme.with(Number, () => ({
      __type__: 'number'
    }))

    // After declaration
    expect(scheme.getField(Number)).toEqual({
      transform: expect.any(Function),
      getResource: expect.any(Function),
      __type__: 'number'
    })
  })

  it('Can extend field', () => {
    let scheme = createScheme().with(Number, () => ({
      __type__: 'number'
    }))

    // Before declaration
    expect(scheme.getField(Number)).toEqual({
      transform: expect.any(Function),
      getResource: expect.any(Function),
      __type__: 'number'
    })

    scheme = scheme.with(Number, (parent) => ({
      ...parent,
      __extra_field__: true
    }))

    // After declaration
    expect(scheme.getField(Number)).toEqual({
      transform: expect.any(Function),
      getResource: expect.any(Function),
      __type__: 'number',
      __extra_field__: true
    })
  })

  it('Can transform', () => {
    const scheme = createScheme().with(Number, (_parent, _fields, pipe) => ({
      __type__: 'number',
      evaluate: (value: number) =>
        pipe.reduce(
          (currentValue, transformation) => transformation(currentValue) as any,
          value
        )
    }))

    expect(scheme.getField(Number)).toEqual({
      transform: expect.any(Function),
      getResource: expect.any(Function),
      __type__: 'number',
      evaluate: expect.any(Function)
    })

    expect(
      scheme
        .getField(Number)
        .transform((x) => x + 1)
        .transform((x) => x + 1)
        .transform((x) => x + 1)
        .evaluate(0)
    ).toEqual(3)
  })

  it('Can transform to another field', () => {
    const scheme = createScheme()
      .with(Number, () => ({
        __type__: 'number'
      }))
      .with(String, () => ({
        __type__: 'string'
      }))

    expect(scheme.getField(Number)).toEqual({
      transform: expect.any(Function),
      getResource: expect.any(Function),
      __type__: 'number'
    })

    expect(scheme.getField(String)).toEqual({
      transform: expect.any(Function),
      getResource: expect.any(Function),
      __type__: 'string'
    })

    // One level of transformation

    expect(scheme.getField(Number).transform(String, (x) => `${x}`)).toEqual({
      transform: expect.any(Function),
      getResource: expect.any(Function),
      __type__: 'string'
    })

    expect(scheme.getField(String).transform(Number, (x) => Number(x))).toEqual(
      {
        transform: expect.any(Function),
        getResource: expect.any(Function),
        __type__: 'number'
      }
    )

    // Circular transformation

    expect(
      scheme
        .getField(Number)
        .transform(String, (x) => `${x}`)
        .transform(Number, (x) => Number(x)).__type__
    ).toEqual('number')

    expect(
      scheme
        .getField(Number)
        .transform(String, (x) => `${x}`)
        .transform(Number, (x) => Number(x))
    ).toEqual({
      transform: expect.any(Function),
      getResource: expect.any(Function),
      __type__: 'number'
    })
  })

  it('Can use defined params', () => {
    const scheme = createScheme()
      .with(Number, () => ({
        __type__: 'number'
      }))
      .with(Number, (parent) => ({
        ...parent,
        __own_fnc__: (x: number) => x + 1
      }))

    expect(scheme.getField(Number)).toEqual({
      transform: expect.any(Function),
      getResource: expect.any(Function),
      __type__: 'number',
      __own_fnc__: expect.any(Function)
    })

    expect(scheme.getField(Number).__type__).toBe('number')
    expect(scheme.getField(Number).__own_fnc__(1)).toBe(2)
  })

  it('Can use defined params after transformation', () => {
    const scheme = createScheme()
      .with(Number, () => ({
        __own_fnc_number__: (x: number) => x + 1
      }))
      .with(String, () => ({
        __own_fnc_string__: (x: number) => x + 1
      }))

    expect(
      scheme
        .getField(Number)
        .transform(String, (x) => `${x}`)
        .__own_fnc_string__(1)
    ).toBe(2)

    expect(
      scheme
        .getField(String)
        .transform(Number, (x) => Number(x))
        .__own_fnc_number__(1)
    ).toBe(2)
  })
})

describe('Pipe usage', () => {
  it('Can be defined', () => {
    const scheme = createScheme()
      .with(Number, (parent, fields, pipe) => ({
        ...parent,
        __type__: 'number',
        __to_string__: () => fields(String, [...pipe, () => ''])
      }))
      .with(String, (parent, fields, pipe) => ({
        ...parent,
        __type__: 'string',
        __to_number__: () => fields(Number, [...pipe, () => 0])
      }))

    expect(scheme.getField(Number).__to_string__().__type__).toEqual('string')
    expect(scheme.getField(String).__to_number__().__type__).toEqual('number')

    expect(
      scheme.getField(Number).__to_string__().__to_number__().__type__
    ).toEqual('number')
  })

  it('Can be defined in many ways', () => {
    const scheme = createScheme()
      .with(Number, (parent, fields, pipe) => ({
        ...parent,

        __direct_field__: fields(String, [...pipe, () => '']),
        __one_level_fn__: () => fields(String, [...pipe, () => '']),
        __two_levels_fn__: () => () => fields(String, [...pipe, () => '']),
        __three_levels_fn__: () => () => () =>
          fields(String, [...pipe, () => '']),

        __in_obj__: {
          __direct_field__: fields(String, [...pipe, () => '']),
          __one_level_fn__: () => fields(String, [...pipe, () => '']),
          __two_levels_fn__: () => () => fields(String, [...pipe, () => '']),
          __three_levels_fn__: () => () => () =>
            fields(String, [...pipe, () => '']),

          __in_obj__: {
            __one_level_fn__: () => fields(String, [...pipe, () => ''])
          },

          __in_array: [
            fields(String, [...pipe, () => '']),
            () => fields(String, [...pipe, () => ''])
          ] as const
        },

        __in_arr__: [
          fields(String, [...pipe, () => '']),
          () => fields(String, [...pipe, () => '']),
          () => () => fields(String, [...pipe, () => '']),
          () => () => () => fields(String, [...pipe, () => '']),

          // In obj
          {
            __direct_field__: fields(String, [...pipe, () => '']),
            __one_level_fn__: () => fields(String, [...pipe, () => '']),
            __two_levels_fn__: () => () => fields(String, [...pipe, () => '']),
            __three_levels_fn__: () => () => () =>
              fields(String, [...pipe, () => ''])
          },

          // In array
          [
            fields(String, [...pipe, () => '']),
            () => fields(String, [...pipe, () => ''])
          ] as const
        ] as const
      }))
      .with(String, (parent) => ({
        ...parent,
        __type__: 'string'
      }))

    // Functions
    expect(scheme.getField(Number).__direct_field__.__type__).toEqual('string')
    expect(scheme.getField(Number).__one_level_fn__().__type__).toEqual(
      'string'
    )
    expect(scheme.getField(Number).__two_levels_fn__()().__type__).toEqual(
      'string'
    )
    expect(scheme.getField(Number).__three_levels_fn__()()().__type__).toEqual(
      'string'
    )

    // In obj
    expect(
      scheme.getField(Number).__in_obj__.__direct_field__.__type__
    ).toEqual('string')
    expect(
      scheme.getField(Number).__in_obj__.__one_level_fn__().__type__
    ).toEqual('string')
    expect(
      scheme.getField(Number).__in_obj__.__two_levels_fn__()().__type__
    ).toEqual('string')
    expect(
      scheme.getField(Number).__in_obj__.__three_levels_fn__()()().__type__
    ).toEqual('string')

    // In obj in obj
    expect(
      scheme.getField(Number).__in_obj__.__in_obj__.__one_level_fn__().__type__
    ).toEqual('string')

    // In obj in array
    expect(scheme.getField(Number).__in_obj__.__in_array[0].__type__).toEqual(
      'string'
    )
    expect(scheme.getField(Number).__in_obj__.__in_array[1]().__type__).toEqual(
      'string'
    )

    // In array
    expect(scheme.getField(Number).__in_arr__[0].__type__).toEqual('string')
    expect(scheme.getField(Number).__in_arr__[1]().__type__).toEqual('string')
    expect(scheme.getField(Number).__in_arr__[2]()().__type__).toEqual('string')
    expect(scheme.getField(Number).__in_arr__[3]()()().__type__).toEqual(
      'string'
    )

    // In array in obj
    expect(
      scheme.getField(Number).__in_arr__[4].__direct_field__.__type__
    ).toEqual('string')
    expect(
      scheme.getField(Number).__in_arr__[4].__one_level_fn__().__type__
    ).toEqual('string')
    expect(
      scheme.getField(Number).__in_arr__[4].__two_levels_fn__()().__type__
    ).toEqual('string')
    expect(
      scheme.getField(Number).__in_arr__[4].__three_levels_fn__()()().__type__
    ).toEqual('string')

    // In array in array
    expect(scheme.getField(Number).__in_arr__[5][0].__type__).toEqual('string')
    expect(scheme.getField(Number).__in_arr__[5][1]().__type__).toEqual(
      'string'
    )
  })
})

describe('Resource usage', () => {
  it('Can be created', () => {
    enum Type {
      INPUT,
      SELECT
    }
    type Resource = {
      type: Type.INPUT | Type.SELECT
      initValue: string
    }

    const scheme = createScheme<Resource>()
      .with(String, (parent, fields, pipe, resource) => ({
        ...parent,

        concat: (value: string) =>
          fields(String, pipe, {
            ...resource,
            initValue: resource.initValue + value
          })
      }))
      .with(Number, (parent, fields, pipe, resource) => ({
        ...parent,

        addNumber: (value: number) =>
          fields(Number, pipe, {
            ...resource,
            initValue: resource.initValue + `${value}`
          })
      }))

    expect(
      scheme
        .getField(String, [], { type: Type.INPUT, initValue: '' })
        .concat('a')
        .concat('b')
        .concat('c')
        .getResource()
    ).toEqual({ type: Type.INPUT, initValue: 'abc' })

    const field = scheme
      .getField(String, [], { type: Type.INPUT, initValue: '' })
      .concat('a')
      .concat('b')
      .concat('c')
      .transform(Number, (value) => Number(value))
      .addNumber(1)
      .addNumber(2)
      .addNumber(3)
      .transform(String, (value) => String(value))

    expect(field.getResource()).toEqual({
      type: Type.INPUT,
      initValue: 'abc123'
    })

    // type FieldResourceType = GetResourceType<typeof field>
  })
})
