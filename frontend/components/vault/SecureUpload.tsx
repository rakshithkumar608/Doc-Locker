'use client';

import { useState, useRef } from 'react';
import { Upload,  Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useVaultData } from '@/hooks/useVaultData';
import { encryptFile } from '@/lib/encryption';
import { useEncryption } from '@/app/contexts/EncryptionContext';

export function SecureUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFileName, setCurrentFileName] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addFile } = useVaultData();
  const { masterKey } = useEncryption();

  const processFiles = async (fileList: FileList | File[]) => {
    if (!masterKey) {
      toast.error("Vault is locked. Please unlock first.");
      return;
    }

    setUploading(true);
    setProgress(0);

    const files = Array.from(fileList);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setCurrentFileName(file.name);
      
      try {
        if (file.size > 50 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 50MB)`);
          continue;
        }

        const { encryptedBuffer } = await encryptFile(file, masterKey);

        const fileType = getFileType(file);

        addFile({
          name: file.name,
          originalName: file.name,
          type: fileType,
          size: encryptedBuffer.byteLength,
          category: fileType,
          tags: [fileType, file.name.split('.').pop() || 'file'],
          encrypted: true,
        });

        setProgress(Math.round(((i + 1) / files.length) * 100));

      } catch (err) {
        toast.error(`Failed to encrypt ${file.name}`);
      }
    }

    setTimeout(() => {
      setUploading(false);
      setProgress(0);
      setCurrentFileName('');
      toast.success(`${files.length} file(s) encrypted and secured successfully!`);
    }, 800);
  };

  const getFileType = (file: File): 'document' | 'card' | 'certificate' => {
    const ext = file.name.toLowerCase().split('.').pop();
    if (['jpg','jpeg','png','webp'].includes(ext || '')) return 'card';
    if (['pdf','doc','docx'].includes(ext || '')) return 'certificate';
    return 'document';
  };

 
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  return (
    <Card className={`glass border-2 transition-all ${isDragging ? 'border-indigo-500' : 'border-dashed border-zinc-700'}`}>
      <CardContent className="py-14 text-center min-h-95 flex flex-col items-center justify-center">
        {uploading ? (
          <div className="w-full max-w-xs space-y-6">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-indigo-400" />
            <div>
              <p className="font-medium">Encrypting {currentFileName}</p>
              <Progress value={progress} className="mt-4" />
              <p className="text-xs text-zinc-500 mt-2">{progress}% complete</p>
            </div>
          </div>
        ) : (
          <>
            <Upload className="w-16 h-16 text-zinc-400 mb-6" />
            <h3 className="text-2xl font-semibold mb-2">Secure Upload</h3>
            <p className="text-zinc-400 mb-8">Files are encrypted in your browser</p>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => e.target.files && processFiles(e.target.files)}
              className="hidden"
            />

            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-indigo-600 hover:bg-indigo-700 px-10 py-6 rounded-2xl"
            >
              Select Files
            </Button>

            <p className="text-xs text-zinc-500 mt-6">or drag & drop anywhere</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}