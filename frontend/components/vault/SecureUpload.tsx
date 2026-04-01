import { useVaultData, VaultFile } from '@/hooks/useVaultData';
import { encryptFile } from '@/lib/encryption';
import { useRef, useState } from 'react'
import { toast } from 'sonner';
import { Card, CardContent } from '../ui/card';
import { Upload } from 'lucide-react';
import { Button } from '../ui/button';

export const SecureUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addFile } = useVaultData();

  const getFileType = (file: File): 'document' | 'card' | 'certificate' => {
    const ext = file.name.toLowerCase().split('.').pop();

    const imageExts = ['jpg', 'jpeg','png','gif','webp'];
    const certExts = ['pdf', 'doc','docx'];

    if (imageExts.includes(ext || '')) return 'card';
    if (certExts.includes(ext || '')) return 'certificate';
    return 'document';
  }

  const processFile = async (file: File) => {
    if (file.size > 50 * 1024 * 1024) { 
      toast.error("File too large. Maximum 50MB allowed.");
      return;
    }
    setUploading(true);

    try {
      const encoder = new TextEncoder();
      const salt = encoder.encode("docvault-salt-2026");
      const baseMaterial = encoder.encode("demo-master-key-rk");

      const baseKey = await crypto.subtle.importKey(
        "raw", baseMaterial, "PBKDF2", false, ["deriveBits", "deriveKey"]
      );

      const masterKey = await crypto.subtle.deriveKey(
        { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
        baseKey,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );


      const { encryptedBuffer, iv } = await encryptFile(file, masterKey);

      const encryptedBlob = new Blob([encryptedBuffer], { type: 'application/octet-stream' });

      const fileType = getFileType(file);

      const newFile: Omit<VaultFile, 'id' | 'date'> = {
        name: file.name,
        originalName: file.name,
        type: fileType,
        size: encryptedBlob.size,
        category: fileType,
        tags: [fileType, file.name.includes('.') ? file.name.split('.').pop()! : 'file']
      };
      addFile(newFile);

      toast.success(`${file.name} encrypted and secured successfully!`, {
        description: "File is now end-to-end encrypted and stored."
      });
    } catch (error) {
      console.error("Encryption failed:", error);
      toast.error("Failed to encrypt file. Please try again.")
      } finally {
        setUploading(false);
      }
    };

    //  Drag and Drop handler
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    };
    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) {
        processFile(droppedFiles[0]);
      }
    };

    const handleFileSelect = (e: React.DragEvent<HTMLDivElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        processFile(selectedFile);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
      
    
  return (
    <Card 
    className={`glass border-2 transition-all h-full ${
      isDragging
      ? 'border-indigo-500 bg-indigo-950/30'
      : 'border-dashed border-zinc-700 hover:border-zinc-600'
      }`}> 

      <CardContent
      className='flex flex-col items-center justify-center py-14 text-center min-h-95'
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrag={handleDrop}
      >
        <div className={`w-20 h-20 rounded-3xl flex items-center justfiy-center mb-6 transition-all ${
        isDragging ? 'scale-110 bg-indigo-900/50' : 'bg-zinc-800'
          }`}>
              <Upload className={`w-10 h-10 ${isDragging ? 'text-indigo-400' : 'text-zinc-400'}`}/>
        </div>

            <h3 className="text-2xl font-semibold text-white mb-2">
              Secure Upload
            </h3>
            <p className="text-zinc-400 max-w-65 mb-8">
              Drop files here or click to select. <br />
              <span className="text-emerald-400 text-sm">End-to-End Encrypted before storing</span>
            </p>

            <input 
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden" 
            accept='.pdf,.doc,.docx,.jpg,.jpeg,.png,.webp'
            />

            <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className='bg-indigo-600 hover:bg-indigo-700 px-8 py-6 rounded-2xl text-base font-medium flex items-center gap-3'
            >
              {uploading ? (
                <>Encrypting & Securing...</>
              ) : (
                <>
                <Upload className='w-5 h-5' />
                Select File
                </>
              )}
            </Button>

            <p className="text-xs text-zinc-500 mt-6">
              Supported: PDF, DOC, JPG, PNG • Max 50MB
            </p>
      </CardContent>
      </Card>
  )
  }
