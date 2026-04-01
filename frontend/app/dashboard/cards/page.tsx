"use client";

import { FileCard } from "@/components/vault/FileCard";
import { FileViwerModel } from "@/components/vault/FileViewerModel";
import { useVaultData, VaultFile } from "@/hooks/useVaultData";
import { CreditCard, RefreshCcw } from "lucide-react";
import { useState } from "react";

export default function CardsPage() {
  const { files, loading, deleteFile } = useVaultData();
  const [selectedFile, setSelectedFile] = useState<VaultFile | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const cards = files.filter(file => file.type === 'card');

  const handleViewFile = (file: VaultFile) => {
    setSelectedFile(file);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setTimeout(() => setSelectedFile(null), 300);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCcw className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-3">
              <CreditCard className="w-9 h-9 text-emerald-400"/>
              ID Cards
            </h1>
            <p className="text-zinc-400 mt-2">
              Your Aadhar, PAN, Driving License, etc.
            </p>
        </div>
        <div className="text-sm text-zinc-400">
          {cards.length} cards
        </div>
      </div>

      {cards.length === 0 ? (
        <div className="glass border border-dashed border-zinc-700 rounded-3xl p-20 text-center">
          <CreditCard className="w-16 h-16 mx-auto text-zinc-600 mb-4" />
          <p className="text-xl text-zinc-400">No ID cards yet</p>
          <p className="text-zinc-500 mt-2">Upload images of your ID cards</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onDelete={deleteFile}
              onView={handleViewFile}
            />
          ))}

          <FileViwerModel 
          file={selectedFile}
          isOpen={isViewerOpen}
          onClose={handleCloseViewer}
          />
        </div>
      )}
    </div>
  )
}