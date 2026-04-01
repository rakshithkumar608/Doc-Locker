import { Bell, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";



export function Header() {
  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md px-8 flex items-center justify-between z-50">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-white">DocVault</h2>
      </div>

      <div className="flex items-center p-3 gap-10">
        <Button variant="ghost" size="icon" className="p-2">
          <Bell className="h-5 w-5 text-zinc-400"/>
        </Button>

        <Avatar className="h-full w-full border border-zinc-700">
          <AvatarFallback className="bg-indigo-600 text-white">R</AvatarFallback>
        </Avatar>
        <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-red-400 w-full p-2 flex">
          <LogOut className="h-4 w-4 mr-2" />
          Lock
        </Button>
      </div>
    </header>
  )
}