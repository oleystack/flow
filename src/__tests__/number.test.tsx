import { describe, expect, test } from 'vitest'
import { field } from '..'

describe('NumberField API', () => {
  test('equals', async () => {
    expect(
      await field.number('Error message').equals(1).validate(1)
    ).toMatchObject({
      isValid: true,
      errors: [],
      value: 1
    })

    expect(
      await field
        .number('Error message 1')
        .equals(1.01, 'Error message 2')
        .validate(1)
    ).toMatchObject({
      isValid: false,
      errors: ['Error message 2'],
      value: 1
    })

    expect(
      await field
        .number('Error message 1')
        .equals(32, 'Error message 2')
        .validate(11234)
    ).toMatchObject({
      isValid: false,
      errors: ['Error message 2'],
      value: 11234
    })

    // With parsing
    expect(
      await field
        .number('Error message 1')
        .equals(123, 'Error message 2')
        .validate('123')
    ).toMatchObject({
      isValid: true,
      errors: [],
      value: 123
    })
  })

  test('greaterThan', async () => {
    expect(
      await field.number().greaterThan(2, 'Error message').validate(3)
    ).toMatchObject({
      isValid: true,
      errors: [],
      value: 3
    })

    expect(
      await field.number().greaterThan(2, 'Error message').validate(2)
    ).toMatchObject({
      isValid: false,
      errors: ['Error message'],
      value: 2
    })

    expect(
      await field.number().greaterThan(2, 'Error message').validate(1)
    ).toMatchObject({
      isValid: false,
      errors: ['Error message'],
      value: 1
    })
  })

  test('greaterThanOrEquals', async () => {
    expect(
      await field.number().greaterThanOrEquals(2, 'Error message').validate(3)
    ).toMatchObject({
      isValid: true,
      errors: [],
      value: 3
    })

    expect(
      await field.number().greaterThanOrEquals(2, 'Error message').validate(2)
    ).toMatchObject({
      isValid: true,
      errors: [],
      value: 2
    })

    expect(
      await field.number().greaterThanOrEquals(2, 'Error message').validate(1)
    ).toMatchObject({
      isValid: false,
      errors: ['Error message'],
      value: 1
    })
  })

  test('lessThan', async () => {
    expect(
      await field.number().lessThan(2, 'Error message').validate(3)
    ).toMatchObject({
      isValid: false,
      errors: ['Error message'],
      value: 3
    })

    expect(
      await field.number().lessThan(2, 'Error message').validate(2)
    ).toMatchObject({
      isValid: false,
      errors: ['Error message'],
      value: 2
    })

    expect(
      await field.number().lessThan(2, 'Error message').validate(1)
    ).toMatchObject({
      isValid: true,
      errors: [],
      value: 1
    })
  })

  test('lessThanOrEquals', async () => {
    expect(
      await field.number().lessThanOrEquals(2, 'Error message').validate(3)
    ).toMatchObject({
      isValid: false,
      errors: ['Error message'],
      value: 3
    })

    expect(
      await field.number().lessThanOrEquals(2, 'Error message').validate(2)
    ).toMatchObject({
      isValid: true,
      errors: [],
      value: 2
    })

    expect(
      await field.number().lessThanOrEquals(2, 'Error message').validate(1)
    ).toMatchObject({
      isValid: true,
      errors: [],
      value: 1
    })
  })

  test('integer', async () => {
    expect(
      await field.number().integer('Error message').validate(1)
    ).toMatchObject({
      isValid: true,
      errors: [],
      value: 1
    })

    expect(
      await field.number().integer('Error message').validate(1.03)
    ).toMatchObject({
      isValid: false,
      errors: ['Error message'],
      value: 1.03
    })
  })

  test('meets', async () => {
    // Todo: Add tests for async fn

    expect(
      await field
        .number()
        .meets(() => true, 'Error message')
        .validate(1)
    ).toMatchObject({
      isValid: true,
      errors: [],
      value: 1
    })

    expect(
      await field
        .number()
        .meets(() => false, 'Error message')
        .validate(1)
    ).toMatchObject({
      isValid: false,
      errors: ['Error message'],
      value: 1
    })

    expect(
      await field
        .number()
        .meets((value) => value === 1, 'Error message')
        .validate(1)
    ).toMatchObject({
      isValid: true,
      errors: [],
      value: 1
    })

    expect(
      await field
        .number()
        .meets((value) => value === 1, 'Error message')
        .validate(2)
    ).toMatchObject({
      isValid: false,
      errors: ['Error message'],
      value: 2
    })
  })

  test('noneOf', async () => {
    expect(
      await field.number().noneOf([1, 2, 3], 'Error message').validate(4)
    ).toMatchObject({
      isValid: true,
      errors: [],
      value: 4
    })

    expect(
      await field.number().noneOf([1, 2, 3], 'Error message').validate(2)
    ).toMatchObject({
      isValid: false,
      errors: ['Error message'],
      value: 2
    })
  })

  test('oneOf', async () => {
    expect(
      await field.number().oneOf([1, 2, 3], 'Error message').validate(4)
    ).toMatchObject({
      isValid: false,
      errors: ['Error message'],
      value: 4
    })

    expect(
      await field.number().oneOf([1, 2, 3], 'Error message').validate(2)
    ).toMatchObject({
      isValid: true,
      errors: [],
      value: 2
    })
  })

  test('to', async () => {
    expect(
      await field
        .number()
        .to((value) => `Hello ${value}!`, 'Error message')
        .validate(4)
    ).toMatchObject({
      value: 'Hello 4!'
    })
  })
})
