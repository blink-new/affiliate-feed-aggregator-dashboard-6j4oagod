import { useState, useRef } from 'react';
import { FileUp, Check, AlertCircle, FileText, X } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type FileFormat = 'csv' | 'json' | 'xml';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  acceptedFormats?: FileFormat[];
  className?: string;
}

export function FileUploader({ 
  onFileSelect, 
  acceptedFormats = ['csv', 'json', 'xml'], 
  className 
}: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedFileTypes = acceptedFormats.map(format => `.${format}`).join(',');

  const handleFileSelect = (selectedFile: File) => {
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase() as FileFormat;
    
    if (!acceptedFormats.includes(fileExtension)) {
      setError(`Invalid file format. Please upload ${acceptedFormats.join(', ')} files only.`);
      return;
    }

    setError(null);
    setFile(selectedFile);
    onFileSelect(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'csv':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'json':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'xml':
        return <FileText className="h-5 w-5 text-orange-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        type="file"
        ref={fileInputRef}
        accept={acceptedFileTypes}
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        className="hidden"
      />
      
      <AnimatePresence>
        {!file && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 transition-colors duration-200 text-center",
                isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                error && "border-destructive/50 bg-destructive/5"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center gap-4">
                {error ? (
                  <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <FileUp className="h-6 w-6" />
                  </div>
                )}
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {error || 'Drag and drop your file here'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {!error && `Supported formats: ${acceptedFormats.join(', ').toUpperCase()}`}
                  </p>
                </div>
                
                {!error && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    type="button" 
                    onClick={handleBrowseClick}
                  >
                    Browse Files
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
        
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border rounded-lg p-4 bg-background"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md border bg-background flex items-center justify-center">
                  {getFileIcon(file.name)}
                </div>
                <div>
                  <p className="text-sm font-medium truncate max-w-[180px] sm:max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Check className="h-4 w-4" />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-destructive"
                  onClick={handleRemoveFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}