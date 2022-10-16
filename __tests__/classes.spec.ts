import { createScheme } from '../src/scheme'

describe('Class Rectangle usage', () => {
  class MyRectangle {
    private height: number
    private width: number

    constructor(height, width) {
      this.height = height
      this.width = width
    }

    get area() {
      return this.width * this.height
    }
  }

  it('Can be created', () => {
    const scheme = createScheme()
      .with(Number, (_parent, fields, pipe) => ({
        pow: (exponent: number) =>
          fields(Number, [...pipe, (value) => value ** exponent]),
        evaluate: (value: number) =>
          pipe.reduce(
            (currentValue, transformation) => transformation(currentValue),
            value
          )
      }))
      .with(MyRectangle, (_parent, fields, pipe) => ({
        toArea: () => fields(Number, [...pipe, (value) => value.area])
      }))

    expect(
      scheme
        .getField(Number)
        .pow(2)
        .transform((value) => value + 1)
        .transform(MyRectangle, (value) => new MyRectangle(value, value))
        .toArea()
        .evaluate(2)
    ).toEqual(25)
  })
})

describe('Constructor Multiselect usage', () => {
  class Multiselect {
    private options: string[]

    constructor(options: string[]) {
      this.options = options
    }
  }

  it('Can be created', () => {
    const scheme = createScheme().with(
      Multiselect,
      (_parent, fields, pipe) => ({
        init: () =>
          fields(Multiselect, [
            ...pipe,
            () => new Multiselect(['a', 'b', 'c'])
          ]),
        get: () =>
          pipe.reduce(
            (currentValue, transformation) => transformation(currentValue),
            new Multiselect([])
          )
      })
    )

    expect(
      scheme
        .getField(Multiselect)
        .init()
        .transform(() => new Multiselect(['a', 'b']))
        .get()
    ).toEqual(new Multiselect(['a', 'b']))
  })
})

describe('Multiselect with Set usage', () => {
  it('Can be created', () => {
    const scheme = createScheme().with(
      Set<string>,
      (_parent, fields, pipe) => ({
        init: () =>
          fields(Set<string>, [...pipe, () => new Set(['a', 'b', 'c'])]),
        get: () =>
          pipe.reduce(
            (currentValue, transformation) => transformation(currentValue),
            new Set()
          )
      })
    )

    expect(
      scheme
        .getField(Set<string>)
        .init()
        .transform(() => new Set(['a', 'b']))
        .get()
    ).toEqual(new Set(['a', 'b']))
  })
})

describe('Multiselect with Array usage', () => {
  it('Can be created', () => {
    const scheme = createScheme().with(
      Array<string>,
      (_parent, fields, pipe) => ({
        init: () => fields(Array<string>, [...pipe, () => ['a', 'b', 'c']]),
        get: () =>
          pipe.reduce(
            (currentValue, transformation) => transformation(currentValue),
            []
          )
      })
    )

    expect(
      scheme
        .getField(Array<string>)
        .init()
        .transform(() => ['a', 'b'])
        .get()
    ).toEqual(['a', 'b'])
  })
})
