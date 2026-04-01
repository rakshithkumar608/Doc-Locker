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
            try {
                const parsed = JSON.parse(savedFiles);


                const cleanFiles: VaultFile[] = parsed.filter(
                    (f: any) =>
                        f &&
                        typeof f === 'object' &&
                        f.type &&
                        f.size !== undefined
                );

                setFiles(cleanFiles);
            } catch (err) {
                console.error("Error parsing localStorage:", err);
                setFiles([]);
            }
        }

        setLoading(false);
    }, []);

   
    const saveFiles = (updatedFiles: VaultFile[]) => {
        setFiles(updatedFiles);
        localStorage.setItem('docvault_files', JSON.stringify(updatedFiles));
    };

    
    const addFile = (newFile: Omit<VaultFile, 'id' | 'date'>) => {
        const file: VaultFile = {
            ...newFile,
            id:
                Date.now().toString(36) +
                Math.random().toString(36).substr(2),
            date: new Date().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
        };

       
        const updated = [file, ...files];

        saveFiles(updated);
        return file;
    };

    
    const deleteFile = (id: string) => {
        const updated = files.filter(f => f && f.id !== id);
        saveFiles(updated);
    };

  
    const validFiles = files.filter(f => f);

    const stats = {
        totalFiles: validFiles.length,
        documents: validFiles.filter(f => f.type === 'document').length,
        cards: validFiles.filter(f => f.type === 'card').length,
        certificates: validFiles.filter(f => f.type === 'certificate').length,
        storageUsed:
            (
                validFiles.reduce((sum, f) => sum + (f.size || 0), 0) /
                (1024 * 1024)
            ).toFixed(1) + ' MB',
    };


    const recentFiles = [...validFiles].slice(0, 6);

    return {
        files: validFiles,
        recentFiles,
        stats,
        loading,
        addFile,
        deleteFile,
    };
}