import React, { useState, useEffect } from 'react';
import { Upload, File, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { documentService, Document } from '@/services/documentService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const DocumentUpload = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user]);

  const loadDocuments = async () => {
    if (!user) return;
    try {
      const docs = await documentService.getDocuments(user.uid);
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load documents');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files?.length) return;

    const file = event.target.files[0];
    setUploading(true);

    try {
      console.log("yoo"); // temporary for testing
      const document = await documentService.uploadDocument(user.uid, file);
      setDocuments(prev => [...prev, document]);
      toast.success('Document uploaded successfully');
      
      // Start processing the document
      setProcessing(document.id);
      await documentService.processDocument(document.id);
      await loadDocuments(); // Reload to get updated status
      setProcessing(null);
      toast.success('Document processed successfully');
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (document: Document) => {
    if (!user) return;

    try {
      await documentService.deleteDocument(document.id, document.fileUrl);
      setDocuments(prev => prev.filter(doc => doc.id !== document.id));
      toast.success('Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Documents</h2>
        <div className="relative">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.docx,.txt"
          />
          <Button
            asChild
            disabled={uploading}
            className="relative"
          >
            <label htmlFor="file-upload" className="cursor-pointer">
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </>
              )}
            </label>
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {documents.map(document => (
          <div
            key={document.id}
            className="flex items-center justify-between p-4 bg-card rounded-lg border"
          >
            <div className="flex items-center space-x-4">
              <File className="h-8 w-8 text-muted-foreground" />
              <div>
                <h3 className="font-medium">{document.fileName}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(document.fileSize)} • {document.uploadDate.toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {document.status === 'processing' && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </div>
              )}
              
              {document.status === 'completed' && document.processedContent && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // TODO: Show processed content in a modal or new page
                    console.log('Processed content:', document.processedContent);
                  }}
                >
                  View Content
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(document)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {documents.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <File className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>No documents uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  );
}; 