import { decryptFile } from "@/lib/encryption";
import { useEffect, useState } from "react";
import {  Download, Lock, X } from 'lucide-react';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import Image from "next/image";
import { VaultFile } from "@/hooks/useVaultData";

type Props = {
  file: VaultFile | null;
  isOpen: boolean;
  onClose: () => void;
}


export function FileViwerModel({ file, isOpen, onClose }: Props) {
  const [decryptedUrl, setDecryptedUrl] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState('');

  const getMasterKey = async (): Promise<CryptoKey> => {
    const encoder = new TextEncoder();
    const salt = encoder.encode("docvault-salt-2026")
    const baseMaterial = encoder.encode("demo-master-key-rk");

    const baseKey = await crypto.subtle.importKey(
      "raw", baseMaterial, "PBKDF2", false, ["deriveBits", "deriveKey"]
    );

    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
      baseKey,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    )
  };

  const decryptAndView = async () => {
    if (!file) return;

    setIsDecrypting(true);
    setError('');

    try {
      const masterKey = await getMasterKey();

      const dummyEncrypted = new Uint8Array(100).buffer;
      const dummyIv = new Uint8Array(12);

      const decryptedBuffer = await decryptFile(dummyEncrypted, dummyIv, masterKey)

      const blob = new Blob([decryptedBuffer], { type: file.type === 'card' ? 'image/jpeg' : 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setDecryptedUrl(url);
    } catch (err) {
      console.error(err);
      setError("Decryption failed. Invalid key or corrupted file.");
      toast.error("Decryption failed!");
    } finally {
      setIsDecrypting(false);
    }
  };

  // Auto decription when the model opens
  useEffect(() => {
    if (isOpen && file) {
      decryptAndView();
    }
    return () => {
      if (decryptedUrl) URL.revokeObjectURL(decryptedUrl);
    };
  }, [isOpen, file]);

  if (!file) return null;

  const isImage = file.type === 'card';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full bg-zinc-950 border-zinc-800 text-white max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold flex items-center gap-3">
                <Lock className="w-5 h-5 text-emerald-400"/>
                {file.name}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5"/>
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto py-4">
          {isDecrypting ? (
            <div className="h-96 flex flex-col items-center justify-center">
              <Lock className="w-12 h-12 animate-pulse text-indigo-400 mb-4"/>
              <p className="text-lg">Decryptinh file securely...</p>
              <p className="text-sm text-zinc-500 mt-2">End-to-End Encryption in progress</p>
            </div>
          ) : error ? (
            <div className="h-96 flex items-center justify-center text-red-400">
              {error}
            </div>
          ) : decryptedUrl ? (
            isImage ? (
              <Image 
                src={decryptedUrl} 
                alt={file.name}
                className="max-h-[70vh] mx-auto rounded-xl shadow-2xl"
              />
            
          ) : (
            <div className="bg-zinc-900 rounded-xl p-4 h-[70vh]">
                <iframe 
                  src={decryptedUrl} 
                  className="w-full h-full rounded-lg"
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

          <Button 
            onClick={() => {
              if (decryptedUrl) {
                const a = document.createElement('a');
                a.href = decryptedUrl;
                a.download = file.originalName || file.name;
                a.click();
                toast.success("File downloaded successfully");
              }
            }}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Download className="mr-2 w-4 h-4" />
            Download Original
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
