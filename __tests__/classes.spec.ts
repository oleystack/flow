import { createScheme } from '../src/scheme'

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

describe('Classes usage', () => {
  it('Can be created', () => {
    const scheme = createScheme()
      .with(Number, (_parent, fields, pipe) => ({
        pow: (exponent: number) =>
          fields(Number, [...pipe, (value) => value ** exponent]),
        evaluate: (value: number) =>
          pipe.reduce(
            (currentValue, transformation) =>
              transformation(currentValue) as any,
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
