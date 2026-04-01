
import { FileText, Image as ImageIcon, Award, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VaultFile } from '@/hooks/useVaultData';

type Props = {
  file: VaultFile;
  onDelete: (id: string) => void;
  onView: (file: VaultFile) => void;     
};

export function FileCard({ file, onDelete, onView }: Props) {
  const Icon = 
    file.type === 'card' ? ImageIcon : 
    file.type === 'certificate' ? Award : FileText;

  return (
    <Card 
      className="glass border-zinc-800 hover:border-indigo-500/70 transition-all group cursor-pointer"
      onClick={() => onView(file)}           // ← This line was causing the error
    >
      <CardContent className="p-5 relative">
        <div className="flex gap-4">
          <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
            <Icon className="w-7 h-7 text-indigo-400" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-medium text-white truncate pr-8">{file.name}</p>
            <p className="text-xs text-zinc-500 mt-1">
              {(file.size / 1024).toFixed(1)} KB • {file.date}
            </p>

            <div className="flex flex-wrap gap-1 mt-3">
              {file.tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-xs bg-zinc-800">
                  {tag}
                </Badge>
              ))}
              {file.encrypted && (
                <Badge variant="outline" className="text-xs border-emerald-500 text-emerald-400">
                  🔒 Encrypted
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Delete Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500"
          onClick={(e) => {
            e.stopPropagation(); 
            onDelete(file.id);
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
}