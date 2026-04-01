'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { deriveKey } from '@/lib/encryption';

type EncryptionContextType = {
  masterKey: CryptoKey | null;
  isLocked: boolean;
  unlockVault: (pin: string) => Promise<boolean>;
  lockVault: () => void;
};

const EncryptionContext = createContext<EncryptionContextType | undefined>(undefined);

export function EncryptionProvider({ children }: { children: ReactNode }) {
  const [masterKey, setMasterKey] = useState<CryptoKey | null>(null);
  const [isLocked, setIsLocked] = useState(true);
  const [salt, setSalt] = useState<Uint8Array | null>(null);

 
  useEffect(() => {
    const savedSalt = localStorage.getItem('docvault_salt');
    
    if (savedSalt) {
      setSalt(new Uint8Array(JSON.parse(savedSalt)));
    } else {
      const newSalt = crypto.getRandomValues(new Uint8Array(16));
      localStorage.setItem('docvault_salt', JSON.stringify(Array.from(newSalt)));
      setSalt(newSalt);
    }
  }, []);

  const unlockVault = async (pin: string): Promise<boolean> => {
    if (!salt) return false;

    try {
      const key = await deriveKey(pin, salt);
      setMasterKey(key);
      setIsLocked(false);
      return true;
    } catch (error) {
      console.error("Unlock failed:", error);
      return false;
    }
  };

  const lockVault = () => {
    setMasterKey(null);
    setIsLocked(true);
  };

  return (
    <EncryptionContext.Provider value={{ 
      masterKey, 
      isLocked, 
      unlockVault, 
      lockVault 
    }}>
      {children}
    </EncryptionContext.Provider>
  );
}

export const useEncryption = () => {
  const context = useContext(EncryptionContext);
  if (context === undefined) {
    throw new Error('useEncryption must be used within an EncryptionProvider');
  }
  return context;
};