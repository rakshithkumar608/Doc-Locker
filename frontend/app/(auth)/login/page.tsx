'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Demo credentials (in real app → connect to backend)
    if (email === 'rakshith@example.com' && password === '123456') {
      // Simulate successful login
      localStorage.setItem('isLoggedIn', 'true');
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 800);
    } else {
      setError('Invalid email or password. Use: rakshith@example.com / 123456');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <Card className="glass w-full max-w-md border-zinc-800">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-linear-to-br from-indigo-500 to-violet-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-white">Welcome to DocVault</CardTitle>
          <p className="text-zinc-400 mt-2">Sign in to access your secure vault</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                <Input
                  type="email"
                  placeholder="rakshith@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 bg-zinc-900 border-zinc-700"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-zinc-900 border-zinc-700 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 text-base bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-zinc-500 text-sm">
              Demo Credentials:<br />
              <span className="text-white">rakshith@example.com</span> / <span className="text-white">123456</span>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-zinc-400 hover:text-white transition">
              ← Back to Lock Screen
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}