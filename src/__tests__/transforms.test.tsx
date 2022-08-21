import { describe, expect, test } from 'vitest'
import { field } from '..'

describe('Transform API', () => {
  test('From number', async () => {
    expect(field.number().to(() => 123, 'Error message')).toMatchObject({
      __type: 'number'
    })

    expect(field.number().to(() => true, 'Error message')).toMatchObject({
      __type: 'boolean'
    })

    expect(
      field.number().to(() => 'Harry Potter', 'Error message')
    ).toMatchObject({
      __type: 'string'
    })

    expect(field.number().to(() => ({}), 'Error message')).toMatchObject({
      __type: 'generic'
    })
  })

  test('From boolean', async () => {
    expect(field.bool().to(() => 123, 'Error message')).toMatchObject({
      __type: 'number'
    })

    expect(field.bool().to(() => true, 'Error message')).toMatchObject({
      __type: 'boolean'
    })

    expect(
      field.bool().to(() => 'Harry Potter', 'Error message')
    ).toMatchObject({
      __type: 'string'
    })

    expect(field.bool().to(() => ({}), 'Error message')).toMatchObject({
      __type: 'generic'
    })
  })

  test('From string', async () => {
    expect(field.string().to(() => 123, 'Error message')).toMatchObject({
      __type: 'number'
    })

    expect(field.string().to(() => true, 'Error message')).toMatchObject({
      __type: 'boolean'
    })

    expect(
      field.string().to(() => 'Harry Potter', 'Error message')
    ).toMatchObject({
      __type: 'string'
    })

    expect(field.string().to(() => ({}), 'Error message')).toMatchObject({
      __type: 'generic'
    })
  })

  test('From generic', async () => {
    expect(
      field
        .string()
        .to(() => ({}))
        .to(() => 123, 'Error message')
    ).toMatchObject({
      __type: 'number'
    })

    expect(
      field
        .string()
        .to(() => ({}))
        .to(() => true, 'Error message')
    ).toMatchObject({
      __type: 'boolean'
    })

    expect(
      field
        .string()
        .to(() => ({}))
        .to(() => 'Harry Potter', 'Error message')
    ).toMatchObject({
      __type: 'string'
    })

    expect(
      field
        .string()
        .to(() => ({}))
        .to(() => ({}), 'Error message')
    ).toMatchObject({
      __type: 'generic'
    })
  })
})

describe('Transform API edge cases', () => {
  test('From string', async () => {
    expect(
      field.string().to((value) => 123 * Number(value), 'Error message')
    ).toMatchObject({
      __type: 'number'
    })

    expect(
      field.string().to((value) => Boolean(value), 'Error message')
    ).toMatchObject({
      __type: 'boolean'
    })

    expect(
      field.string().to((value) => ({ key: value }), 'Error message')
    ).toMatchObject({
      __type: 'generic'
    })
  })

  test('From number', async () => {
    expect(
      field.number().to((value) => 123 * value, 'Error message')
    ).toMatchObject({
      __type: 'number'
    })

    expect(
      field.number().to((value) => 0.21 * value, 'Error message')
    ).toMatchObject({
      __type: 'number'
    })

    expect(
      field.number().to((value) => ({ key: value }), 'Error message')
    ).toMatchObject({
      __type: 'generic'
    })
  })

  test('From boolean', async () => {
    expect(
      field.bool().to((value) => 123 * Number(value), 'Error message')
    ).toMatchObject({
      __type: 'number'
    })

    expect(
      field.bool().to((value) => `${value}`, 'Error message')
    ).toMatchObject({
      __type: 'string'
    })

    expect(
      field.bool().to((value) => ({ key: value }), 'Error message')
    ).toMatchObject({
      __type: 'generic'
    })
  })

  test('From generic', async () => {
    expect(
      field
        .string()
        .to(() => ({}))
        .to((value) => 123 * Number(value), 'Error message')
    ).toMatchObject({
      __type: 'number'
    })

    expect(
      field
        .string()
        .to(() => ({}))
        .to((value) => `${value}`, 'Error message')
    ).toMatchObject({
      __type: 'string'
    })

    expect(
      field
        .string()
        .to(() => ({}))
        .to((value) => Boolean(`${value}`), 'Error message')
    ).toMatchObject({
      __type: 'boolean'
    })
  })
})
