import { describe, it, expect, vi } from 'vitest'
import { getDocument } from '../src/lib/firestore' // update path if needed
import { getDoc, doc } from 'firebase/firestore'

// Mock the Firebase functions
vi.mock('firebase/firestore', () => {
    return {
      doc: vi.fn(),
      getDoc: vi.fn(),
      getFirestore: vi.fn(), // <-- add this
    }
  })
  

describe('getDocument', () => {
  it('returns data when the document exists', async () => {
    const mockData = { name: 'Leah', major: 'CS' }

    // Mock behavior
    const mockDocSnap = {
      exists: () => true,
      data: () => mockData
    }
    ;(getDoc as any).mockResolvedValue(mockDocSnap)

    const result = await getDocument<typeof mockData>('users', 'user123')
    expect(result).toEqual(mockData)
  })

  it('returns null when the document does not exist', async () => {
    const mockDocSnap = {
      exists: () => false
    }
    ;(getDoc as any).mockResolvedValue(mockDocSnap)

    const result = await getDocument<any>('users', 'nonexistent')
    expect(result).toBeNull()
  })
})
