import React, { useState, useEffect } from 'react';
import { Upload, File, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { documentService } from '@/services/documentService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const DocumentUpload = () => {
  const { user } = useAuth();
  const [processing, setProcessing] = useState<string | null>(null);


  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files?.length) return;

    const file = event.target.files[0];

    try {
      console.log("yoo"); // temporary for testing
      
      // Start processing the document
      setProcessing(file.name);
      await documentService.processDocument(file);
      setProcessing(null);
      toast.success('Document processed successfully');
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
            className="relative"
          >
            <label htmlFor="file-upload" className="cursor-pointer"></label>
          </Button>
        </div>
      </div>
    </div>
  );
}; 