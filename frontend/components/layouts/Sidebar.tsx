'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    Award, 
    CreditCard, 
    FileText, 
    Home, 
    Search, 
    Upload} from "lucide-react";
import { Button } from '../ui/button';

const navItems = [
    {
        name: 'Dashboard', 
        href: "/dashboard",
        icon: Home
    },

    {
        name: 'Documents', 
        href: "/dashboard/documents",
        icon: FileText
    },

    {
        name: 'ID Cards', 
        href: "/dashboard/cards",
        icon: CreditCard
    },

    {
        name: 'Certificates', 
        href: "/dashboard/certificates",
        icon: Award
    },

    {
        name: 'Search', 
        href: "/dashboard/search",
        icon: Search
    },
]

export const Sidebar = () => {
    const pathname = usePathname();

  return (
    <div className="w-72 border-r border-zinc-800 bg-zinc-950 flex flex-col">
        <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                🔐
            </div>

            <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">DocVault</h1>
                <p className="text-xs text-zinc-500">Secure Personal Locker</p>
            </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return(
                    <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                        ? 'bg-zinc-800 text-white shadow-inner'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                        }`}
                    >
                        <item.icon className='w-5 h-5'/>
                        {item.name}
                    </Link>
                )
            })}
        </nav>

        <div className="p-4 border-t border-zinc-800 space-y-2">
            <Button className='w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl font-medium transition'>
                <Upload className='w-4 h-4'/>
                Secure Upload
            </Button>

            <div className="flex gap-2">
                <Button className='flex-1 py-2 text-zinc-400 hover:text-white transition'>Settings</Button>
                <Button className='flex-1 py-2 text-red-400 hover:text-red-500 transition'>Lock Vault</Button>
            </div>
        </div>
    </div>
  )
}
