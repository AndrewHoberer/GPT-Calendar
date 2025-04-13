import { describe, it, expect } from 'vitest'

// Sample function to test
function add(a: number, b: number): number {
  return a + b
}

// Tests
describe('add()', () => {
  it('adds two numbers correctly', () => {
    expect(add(2, 3)).toBe(5)
  })

  it('handles negative numbers', () => {
    expect(add(-2, -4)).toBe(-6)
  })
})
