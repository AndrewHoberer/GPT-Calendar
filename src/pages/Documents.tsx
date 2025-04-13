import React from 'react';
import { DocumentUpload } from '@/components/DocumentUpload';

const Documents = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Documents</h1>
        <DocumentUpload />
      </div>
    </div>
  );
};

export default Documents; 