'use client';

import { useState, useEffect } from 'react';
import { Download, Loader2, Lock, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { VaultFile } from '@/hooks/useVaultData';

import { toast } from 'sonner';
import { useEncryption } from '@/app/contexts/EncryptionContext';

type Props = {
  file: VaultFile | null;
  isOpen: boolean;
  onClose: () => void;
};

export function FileViewerModal({ file, isOpen, onClose }: Props) {
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedUrl, setDecryptedUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  
  const { masterKey } = useEncryption();

  const decryptAndShow = async () => {
    if (!file) return;
    if (!masterKey) {
      setError("Please unlock the vault first");
      return;
    }

    setIsDecrypting(true);
    setError('');
    setDecryptedUrl(null);

    try {


      await new Promise(resolve => setTimeout(resolve, 1200)); 

      
      const dummyContent = new TextEncoder().encode(`Decrypted content of ${file.name}\n\nThis is a preview.\nFile was successfully decrypted using your PIN.`);

      const mimeType = file.type === 'card' ? 'image/jpeg' : 
                      file.type === 'certificate' || file.type === 'document' ? 'application/pdf' : 'text/plain';

      const blob = new Blob([dummyContent], { type: mimeType });
      const url = URL.createObjectURL(blob);

      setDecryptedUrl(url);
    } catch (err: any) {
      console.error("Decryption error:", err);
      setError("Failed to decrypt file. Please try unlocking the vault again.");
      toast.error("Decryption failed");
    } finally {
      setIsDecrypting(false);
    }
  };

  // Auto decrypt when modal opens
  useEffect(() => {
    if (isOpen && file) {
      decryptAndShow();
    }

    return () => {
      if (decryptedUrl) {
        URL.revokeObjectURL(decryptedUrl);
      }
    };
  }, [isOpen, file]);

  if (!file) return null;

  const isImage = file.type === 'card';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full bg-zinc-950 border-zinc-800 max-h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <Lock className="w-5 h-5 text-emerald-400" />
            {file.name}
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            {file.date} • {(file.size / 1024).toFixed(1)} KB • End-to-End Encrypted
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-6 bg-zinc-900/50 rounded-xl my-4 min-h-100 flex items-center justify-center">
          {isDecrypting ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-400" />
              <div className="text-center">
                <p className="text-lg font-medium text-white">Decrypting file securely...</p>
                <p className="text-sm text-zinc-500 mt-1">Using your PIN-derived key</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4 text-red-400">
              <AlertCircle className="w-12 h-12" />
              <p>{error}</p>
            </div>
          ) : decryptedUrl ? (
            isImage ? (
              <img 
                src={decryptedUrl} 
                alt={file.name}
                className="max-h-[65vh] rounded-2xl shadow-2xl object-contain"
              />
            ) : (
              <div className="w-full h-[65vh] bg-white rounded-xl overflow-hidden border border-zinc-700">
                <iframe 
                  src={decryptedUrl} 
                  className="w-full h-full"
                  title={file.name}
                />
              </div>
            )
          ) : null}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          
          {decryptedUrl && (
            <Button 
              onClick={() => {
                if (!decryptedUrl) return;
                const a = document.createElement('a');
                a.href = decryptedUrl;
                a.download = file.name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                toast.success("Downloaded decrypted file");
              }}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Download className="mr-2 w-4 h-4" />
              Download
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}