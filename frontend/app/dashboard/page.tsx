'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCard } from "@/components/vault/FileCard";
import { SecureUpload } from "@/components/vault/SecureUpload";
import { useVaultData } from "@/hooks/useVaultData";
import { Award, CreditCard, FileText, HardDrive, RefreshCcw } from "lucide-react";


export default function DashboardPage() {
  const { stats, recentFiles, loading, deleteFile } = useVaultData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCcw className="w-8 h-8 animate-spin text-indigo-500"/>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Welcome back, Rakshith
        </h1>
        <p className="text-zinc-400 mt-2">
          All your documents are end-to-end encrypted • {stats.totalFiles} files secured
        </p>
      </div>

      <div className="grid grid-cols-1 mg:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass border border-zinc-800 bg-zinc-900/50">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-zinc-400">Total Files</CardTitle>
                <FileText className="h-6 w-6 text-blue-400"/>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-semibold text-white">
                {stats.totalFiles}
                <p className="text-xs text-emerald-400 mt-1">+2 since last week</p>
              </div>
            </CardContent>
        </Card>

        <Card className="glass border border-zinc-800 bg-zinc-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-zinc-400">ID Cards</CardTitle>
            <CreditCard className="h-6 w-6 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-semibold text-white">{stats.cards}</div>
            <p className="text-xs text-zinc-500 mt-1">All secure</p>
          </CardContent>
        </Card>

        <Card className="glass border border-zinc-800 bg-zinc-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-zinc-400">Certificates</CardTitle>
            <Award className="h-6 w-6 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-semibold text-white">{stats.certificates}</div>
            <p className="text-xs text-amber-400 mt-1">Check expiry</p>
          </CardContent>
        </Card>

        <Card className="glass border border-zinc-800 bg-zinc-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-zinc-400">Storage Used</CardTitle>
            <HardDrive className="h-6 w-6 text-violet-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-semibold text-white">{stats.storageUsed}</div>
            <p className="text-xs text-zinc-500 mt-1">of 10 GB limit</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <SecureUpload />
        </div>

        <div className="lg:col-span-7">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Recent Files</h2>
            <div className="text-sm text-zinc-400">
              {recentFiles.length} files • Sorted by newest
            </div>
          </div>

          {recentFiles.length === 0 ? (
            <div className="glass border border-dashed border-zinc-700 rounded-3xl p-12 text-center">
              <p className="text-zinc-400">No files yet. Upload Your first document securly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentFiles.map((file) => (
                <FileCard 
                key={file.id} 
                file={file} 
                onDelete={deleteFile}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}