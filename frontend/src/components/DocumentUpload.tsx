
import React, { useCallback, useState } from 'react';
import { usePresentation } from '@/context/PresentationContext';
import { Upload, FileText, X, FileType } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const DocumentUpload = () => {
  const { presentation, setUploadedDocument } = usePresentation();
  const [dragActive, setDragActive] = useState(false);
  
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);
  
  const validateFile = (file: File): boolean => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF, DOCX, or TXT file.',
        variant: 'destructive',
      });
      return false;
    }
    
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'Please upload a file smaller than 10MB.',
        variant: 'destructive',
      });
      return false;
    }
    
    return true;
  };
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setUploadedDocument(file);
        toast({
          title: 'File uploaded',
          description: `${file.name} has been uploaded successfully.`,
        });
      }
    }
  }, [setUploadedDocument]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setUploadedDocument(file);
        toast({
          title: 'File uploaded',
          description: `${file.name} has been uploaded successfully.`,
        });
      }
    }
  };
  
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="h-5 w-5" />;
    if (fileType.includes('word')) return <FileText className="h-5 w-5" />;
    return <FileType className="h-5 w-5" />;
  };
  
  const removeFile = () => {
    setUploadedDocument(null);
  };
  
  return (
    <div className="my-6">
      <h2 className="text-lg font-semibold mb-3">Upload a Document (Optional)</h2>
      
      {presentation.uploadedDocument ? (
        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
          <div className="flex items-center space-x-3">
            {getFileIcon(presentation.uploadedDocument.type)}
            <div>
              <p className="font-medium truncate">{presentation.uploadedDocument.name}</p>
              <p className="text-sm text-muted-foreground">
                {(presentation.uploadedDocument.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={removeFile}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`drag-drop-area ${dragActive ? 'dragging' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleChange}
            accept=".pdf,.docx,.txt"
            disabled={presentation.isGenerating}
          />
          
          <Upload className="h-10 w-10 mb-3 text-muted-foreground" />
          <p className="font-medium mb-1">Drag and drop your file here</p>
          <p className="text-sm text-muted-foreground mb-3">
            Supports PDF, DOCX, and TXT (max 10MB)
          </p>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={presentation.isGenerating}
          >
            Browse files
          </Button>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
