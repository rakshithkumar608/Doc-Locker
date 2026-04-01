'use client';

import { useState, useMemo } from 'react';
import { FileCard } from '@/components/vault/FileCard';
import { FileViewerModal } from '@/components/vault/FileViewerModel';
import { useVaultData, VaultFile } from '@/hooks/useVaultData';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function SearchPage() {
  const { files, loading, deleteFile } = useVaultData();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<VaultFile | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'document' | 'card' | 'certificate'>('all');

  const handleViewFile = (file: VaultFile) => {
    setSelectedFile(file);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setTimeout(() => setSelectedFile(null), 300);
  };

  
  const filteredFiles = useMemo(() => {
    let result = [...files];


    if (activeFilter !== 'all') {
      result = result.filter(file => file.type === activeFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(file => 
        file.name.toLowerCase().includes(query) ||
        file.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }


    return result.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [files, searchQuery, activeFilter]);

  const filterOptions = [
    { label: 'All', value: 'all' as const },
    { label: 'Documents', value: 'document' as const },
    { label: 'ID Cards', value: 'card' as const },
    { label: 'Certificates', value: 'certificate' as const },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-3">
          <Search className="w-9 h-9 text-indigo-400" />
          Search Vault
        </h1>
        <p className="text-zinc-400 mt-2">Find your encrypted files instantly</p>
      </div>


      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search by file name or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 py-6 text-lg bg-zinc-900 border-zinc-700 focus:border-indigo-500 placeholder:text-zinc-500"
        />
      </div>


      <div className="flex flex-wrap gap-2">
        {filterOptions.map((filter) => (
          <Badge
            key={filter.value}
            variant={activeFilter === filter.value ? "default" : "secondary"}
            className={`cursor-pointer px-5 py-2 text-sm transition-all ${
              activeFilter === filter.value 
                ? 'bg-indigo-600 hover:bg-indigo-700' 
                : 'hover:bg-zinc-800'
            }`}
            onClick={() => setActiveFilter(filter.value)}
          >
            {filter.label}
          </Badge>
        ))}
      </div>


      <div>
        <div className="flex justify-between items-center mb-6">
          <p className="text-zinc-400">
            {filteredFiles.length} result{filteredFiles.length !== 1 ? 's' : ''} found
          </p>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-sm text-zinc-500 hover:text-zinc-400"
            >
              Clear search
            </button>
          )}
        </div>

        {filteredFiles.length === 0 ? (
          <div className="glass border border-dashed border-zinc-700 rounded-3xl p-20 text-center">
            <Search className="w-16 h-16 mx-auto text-zinc-600 mb-4" />
            <p className="text-xl text-zinc-400">No files found</p>
            <p className="text-zinc-500 mt-2">
              {searchQuery ? "Try different keywords" : "Upload some files to get started"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFiles.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onDelete={deleteFile}
                onView={handleViewFile}
              />
            ))}
          </div>
        )}
      </div>

   
      <FileViewerModal
        file={selectedFile}
        isOpen={isViewerOpen}
        onClose={handleCloseViewer}
      />
    </div>
  );
}