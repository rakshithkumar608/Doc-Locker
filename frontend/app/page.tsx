'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEncryption } from './contexts/EncryptionContext';


export default function LockScreen() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { unlockVault } = useEncryption();

  const handleUnlock = async () => {
    setLoading(true);
    setError('');

    const success = await unlockVault(pin);

    if (success) {
      setTimeout(() => {
        router.push('/dashboard');
      }, 600);
    } else {
      setError('Incorrect PIN. Try 1234 for demo');
      setPin('');
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleUnlock();
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <Card className="glass w-full max-w-md border-zinc-800">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-white tracking-tight">
            DocVault
          </CardTitle>
          <p className="text-zinc-400 mt-2">Enter PIN to unlock your secure vault</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <Input
              type="password"
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={6}
              className="text-center text-3xl tracking-widest h-16 bg-zinc-900 border-zinc-700 focus:border-indigo-500"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <Button 
            onClick={handleUnlock}
            disabled={loading || pin.length < 4}
            className="w-full h-14 text-lg font-medium bg-indigo-600 hover:bg-indigo-700"
          >
            {loading ? "Unlocking Vault..." : "Unlock Vault"}
          </Button>

          <Button 
            variant="outline" 
            className="w-full h-12 border-zinc-700"
            onClick={() => alert("Passkey / Biometric support coming soon")}
          >
            <Fingerprint className="mr-2 h-5 w-5" />
            Use Fingerprint / Passkey
          </Button>

          <div className="text-center">
            <a href="/login" className="text-sm text-zinc-500 hover:text-white">
              Login with Email instead →
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}