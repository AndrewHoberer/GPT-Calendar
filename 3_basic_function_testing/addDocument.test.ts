import { describe, it, expect, vi } from 'vitest'
import { addDocument } from '../src/lib/firestore' // update the path if needed
import { addDoc, collection } from 'firebase/firestore'

// Mock the Firestore methods
vi.mock('firebase/firestore', () => {
  return {
    addDoc: vi.fn(),
    collection: vi.fn(),
    getFirestore: vi.fn(), // in case it's used in db
  }
})

describe('addDocument', () => {
  it('should return the new document ID after adding', async () => {
    const mockDocRef = { id: 'abc123' }
    ;(addDoc as any).mockResolvedValue(mockDocRef)

    const mockData = { name: 'Leah', major: 'CS' }

    const result = await addDocument<typeof mockData>('users', mockData)
    expect(result).toBe('abc123')
    expect(addDoc).toHaveBeenCalled()
  })

  it('should call collection with correct collection name', async () => {
    const mockDocRef = { id: 'xyz789' }
    ;(addDoc as any).mockResolvedValue(mockDocRef)

    const mockData = { task: 'Finish tests', done: false }

    await addDocument<typeof mockData>('tasks', mockData)

    const lastCall = (collection as any).mock.calls.at(-1)
    expect(lastCall[1]).toBe('tasks')

  })
})
