'use client';

import { FileCard } from "@/components/vault/FileCard";
import { FileViewerModal } from '@/components/vault/FileViewerModel';
import { useVaultData, VaultFile } from "@/hooks/useVaultData";
import { FileText, RefreshCcw } from "lucide-react";
import { useState } from "react";


export default function DocumentsPage() {
  const { files, loading, deleteFile } = useVaultData();
  const [selectedFile, setSelectedFile] = useState<VaultFile | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const documents = files.filter(file => file.type === 'document');

  const handleViewFile = (file: VaultFile) => {
    setSelectedFile(file);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setTimeout(() => setSelectedFile(null), 300);
  };

  if (loading) {
    return(
      <div className="flex items-center justify-center h-96">
        <RefreshCcw className="w-8 h-8 animate-spin text-indigo-500"/>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-3">
            <FileText className="w-9 h-9 text-blue-400"/>
            Documents
          </h1>
          <p className="text-zinc-400 mt-2">
            All your PDFs, World files and other documents
          </p>
        </div>
        <div className="text-sm text-zinc-400">
          {documents.length} documents
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="glass border border-dashed border-zinc-700 rounded-3xl p-20 text-center">
          <FileText className="w-16 h-16 mx-auto text-zinc-600 mb-4"/>
          <p className="text-xl text-zinc-400">No documents yet</p>
          <p className="text-zinc-500 mt-2">
            Upload your first document using the secure upload
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((file) => (
            <FileCard 
            key={file.id}
            file={file}
            onDelete={deleteFile}
            onView={handleViewFile}
            />
          ))}
        </div>
      )}

      <FileViewerModal 
      file={selectedFile}
      isOpen={isViewerOpen}
      onClose={handleCloseViewer}
      />
    </div>
  )
}