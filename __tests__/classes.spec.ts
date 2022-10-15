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
            []
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
