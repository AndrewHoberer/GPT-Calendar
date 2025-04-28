
import React, { useState, useRef } from 'react';
import { Upload, X, Check, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from './Button';

interface UploadCardProps {
  onFileUpload?: (file: File) => void;
  maxFileSizeMB?: number;
  acceptedFileTypes?: string[];
  className?: string;
}

const UploadCard: React.FC<UploadCardProps> = ({
  onFileUpload,
  maxFileSizeMB = 10,
  acceptedFileTypes = ['application/pdf', 'plain/txt', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file: File) => {
    setError(null);
    
    if (!acceptedFileTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a PDF, DOCX, or TXT.');
      return false;
    }
    
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxFileSizeMB}MB.`);
      return false;
    }
    
    return true;
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      setFile(file);
      if (onFileUpload) {
        simulateFileUpload(file);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFile(droppedFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const simulateFileUpload = (file: File) => {
    setIsLoading(true);
    setIsSuccess(false);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      if (onFileUpload) {
        onFileUpload(file);
      }
    }, 2000);
  };

  const resetUpload = () => {
    setFile(null);
    setError(null);
    setIsLoading(false);
    setIsSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop()?.toUpperCase();
  };

  return (
    <div 
      className={cn(
        "w-full glass p-6 rounded-xl border transition-all duration-300 animate-scale-in",
        isDragging ? "border-primary border-dashed bg-primary/5" : "border-border",
        className
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept={acceptedFileTypes.join(',')}
        className="hidden"
      />
      
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="flex flex-col items-center justify-center py-8"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
            <Upload className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium mb-2">Upload Your Document</h3>
          <p className="text-sm text-muted-foreground text-center mb-4 max-w-xs">
            Drag and drop your syllabus, assignment sheet, or any document with deadlines
          </p>
          <Button onClick={handleButtonClick} size="sm">
            Browse Files
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            Max file size: {maxFileSizeMB}MB
          </p>
          
          {error && (
            <div className="mt-4 text-sm text-red-500 text-center">{error}</div>
          )}
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-12 h-12 mr-4 rounded bg-primary/10 flex items-center justify-center text-primary">
              <FileText className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium truncate">{file.name}</h4>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB • {getFileExtension(file.name)}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              {isLoading ? (
                <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              ) : isSuccess ? (
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Check className="h-5 w-5" />
                </div>
              ) : (
                <button
                  onClick={resetUpload}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted-foreground/20 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          {isLoading && (
            <div className="mt-4">
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-shimmer bg-[length:400%_100%] bg-[linear-gradient(90deg,theme(colors.primary)_0%,theme(colors.primary/50)_50%,theme(colors.primary)_100%)]" />
              </div>
              <p className="text-xs text-center mt-2 text-muted-foreground">Extracting deadlines...</p>
            </div>
          )}
          
          {isSuccess && (
            <div className="mt-4 p-3 bg-green-50 text-green-800 text-sm rounded-lg">
              Document uploaded successfully! We've extracted the deadlines.
            </div>
          )}
          
          {!isLoading && !isSuccess && (
            <div className="mt-4">
              <Button onClick={() => simulateFileUpload(file)} fullWidth>
                Process Document
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadCard;
