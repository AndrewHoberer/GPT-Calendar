import { describe, it, expect, vi } from 'vitest';
import { documentService } from '../src/services/documentService'; // Adjust path if needed

// Mock Firebase's Firestore methods
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => 'mockDocRef'),
  updateDoc: vi.fn()
}));

// Mock firebase config file so it doesn't actually try to connect to Firebase
vi.mock('../../src/lib/firebase', () => ({
  storage: {},
  db: {}
}));

describe('documentService.processDocument', () => {
  it('should update document status and processedContent', async () => {
    await documentService.processDocument('123');

    const { doc, updateDoc } = await import('firebase/firestore');

    expect(doc).toHaveBeenCalledWith(expect.anything(), 'documents', '123');
    expect(updateDoc).toHaveBeenCalledWith('mockDocRef', { status: 'processing' });
    expect(updateDoc).toHaveBeenCalledWith('mockDocRef', {
      status: 'completed',
      processedContent: 'Sample processed content'
    });
  });
});
