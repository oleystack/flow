import { describe, expect, test } from 'vitest'
import { field } from '..'

describe('Field initialization', () => {
  test('NumberField init', async () => {
    // Integer
    expect(await field.number('Error message').validate(0)).toMatchObject({
      isValid: true,
      errors: [],
      value: 0
    })

    // Float
    expect(await field.number('Error message').validate(0.3)).toMatchObject({
      isValid: true,
      errors: [],
      value: 0.3
    })

    // String to Number (Inteeger)
    // NOTE: Parsable numbers in string are supported, because are often used in forms
    expect(await field.number('Error message').validate('1')).toMatchObject({
      isValid: true,
      errors: [],
      value: 1
    })

    // String to Number (Float)
    // NOTE: Parsable numbers in string are supported, because are often used in forms
    expect(await field.number('Error message').validate('1.01')).toMatchObject({
      isValid: true,
      errors: [],
      value: 1.01
    })

    // Non-parsable String
    expect(
      await field.number('Error message').validate('Harry Potter')
    ).toMatchObject({
      isValid: false,
      errors: ['Error message'],
      value: 'Harry Potter'
    })

    // Boolean
    expect(await field.number('Error message').validate(true)).toMatchObject({
      isValid: false,
      errors: ['Error message'],
      value: true
    })
  })

  test('StringField init', async () => {
    // String
    expect(
      await field.string('Error message').validate('Harry Potter')
    ).toMatchObject({
      isValid: true,
      errors: [],
      value: 'Harry Potter'
    })

    // Number as string
    expect(await field.string('Error message').validate('12')).toMatchObject({
      isValid: true,
      errors: [],
      value: '12'
    })

    // Number
    expect(await field.string('Error message').validate(123)).toMatchObject({
      isValid: false,
      errors: ['Error message'],
      value: 123
    })

    // Boolean
    expect(await field.string('Error message').validate(true)).toMatchObject({
      isValid: false,
      errors: ['Error message'],
      value: true
    })
  })

  test('BooleanField init', async () => {
    // Boolean
    expect(await field.bool('Error message').validate(true)).toMatchObject({
      isValid: true,
      errors: [],
      value: true
    })

    // String
    expect(
      await field.bool('Error message').validate('Harry Potter')
    ).toMatchObject({
      isValid: false,
      errors: ['Error message'],
      value: 'Harry Potter'
    })

    // Number
    // NOTE: "true", "false", 0, 1 are all valid boolean values
    // because are often used in forms
    expect(await field.bool('Error message').validate(1)).toMatchObject({
      isValid: true,
      errors: [],
      value: true
    })
  })
})
