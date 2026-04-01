// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Fingerprint, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LockScreen() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const handleUnlock = async () => {
    setLoading(true);
    setError('');

    // For now, simple demo PIN: 1234
    if (pin === '1234') {

      setTimeout(() => {
        router.push('/dashboard');
      }, 800);
    } else {
      setError('Incorrect PIN. Try 1234 for demo');
      setPin('');
    }
    
    setLoading(false);
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUnlock();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <Card className="glass w-full max-w-md border-zinc-800">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-linear-to-br from-indigo-500 to-violet-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
            <Lock className="w-10 h-10 text-white" />
          </div>
          
          <CardTitle className="text-3xl font-bold text-white tracking-tight">
            DocVault
          </CardTitle>
          <p className="text-zinc-400 mt-2">Your documents are encrypted and secure</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <p className="text-sm text-zinc-400 mb-2 text-center">Enter PIN to unlock vault</p>
            
            <Input
              type="password"
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={6}
              className="text-center text-2xl tracking-widest h-14 bg-zinc-900 border-zinc-700 focus:border-indigo-500"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <Button 
            onClick={handleUnlock}
            disabled={loading || pin.length < 4}
            className="w-full h-12 text-base font-medium bg-indigo-600 hover:bg-indigo-700"
          >
            {loading ? "Unlocking..." : "Unlock Vault"}
          </Button>

          {/* Biometric Option */}
          <Button 
            variant="outline" 
            className="w-full h-12 border-zinc-700 text-zinc-300 hover:bg-zinc-900"
            onClick={() => alert("Biometric login (Fingerprint/Face ID) coming soon")}
          >
            <Fingerprint className="mr-2 h-5 w-5" />
            Use Fingerprint / Passkey
          </Button>

          <div className="text-center">
            <button 
              onClick={() => router.push('/login')}
              className="text-xs text-zinc-500 hover:text-zinc-400 transition"
            >
              Not you? Login with email
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}