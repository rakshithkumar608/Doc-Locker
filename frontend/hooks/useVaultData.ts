'use client';

import { useEffect, useState } from "react";



export type VaultFile = {
    id: string;
    name: string;
    originalName: string;
    type: 'document' | 'card' | 'certificate';
    size: number;
    date: string;
    category: string;
    tags: string[];
    encrypted: boolean;
};

export function useVaultData() {
    const [files, setFiles] = useState<VaultFile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedFiles = localStorage.getItem('docvault_files');
        if (savedFiles) {
            setFiles(JSON.parse(savedFiles));
        }
        setLoading(false)
    }, []);

    const saveFiles = (updatedFiles: VaultFile[]) => {
        setFiles(updatedFiles);
        localStorage.setItem('docvault_files', JSON.stringify(updatedFiles))
    };

    const addFile = (newFile: Omit<VaultFile, 'id' | 'date'>) => {
        const file: VaultFile = {
            ...newFile,
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            date: new Date().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
        };

        const updated = [File, ...files];
        saveFiles(updated);
        return file;
    };

    const deleteFile = (id: string) => {
        const updated = files.filter(f => f.id !== id);
        saveFiles(updated);
    };

    const stats = {
        totalFiles: files.length,
        documents: files.filter(f => f.type === 'document').length,
        cards: files.filter(f => f.type === 'card').length,
        certificates: files.filter(f => f.type === 'certificate').length,
        storageUsed: (files.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024)).toFixed(1) + ' MB',
    };

    const recentFiles = [...files].slice(0, 6);

    return {
        files,
        recentFiles,
        stats,
        loading,
        addFile,
        deleteFile,
    }
}