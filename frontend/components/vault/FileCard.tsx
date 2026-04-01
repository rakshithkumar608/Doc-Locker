import { VaultFile } from "@/hooks/useVaultData";
import { Award, FileText,Image as  ImageIcon, Trash2 } from "lucide-react"
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

type Props = {
  file: VaultFile;
  onDelete: (id: string) => void;
  onView: (file: VaultFile) => void;
}

export function FileCard({ file, onDelete }: Props) {
  const Icon = 
  file.type === 'card' ? ImageIcon : 
  file.type === 'certificate' ? Award : FileText;

  function onView(file: VaultFile): void {
    throw new Error("Function not implemented.");
  }

  return(
    <Card 
    onClick={() => onView(file)}
    className="glass border-zinc-800 hover:border-indigo-500/70 transition-all group">
      <CardContent className="p-5 relative">
        <div className="flex gap-4">
          <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <Icon className="w-7 h-7 text-indigo-400"/>
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-medium text-white truncate pr-8">
              {file.name}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              { (file.size / 1024).toFixed(1) } KB • {file.date}
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

        <Button 
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500"
        onClick={(e) =>{
          e.stopPropagation();
          onDelete(file.id)}
        } 
        >
          <Trash2 className="w-4 h-4"/>
        </Button>
      </CardContent>
    </Card>
  )
}