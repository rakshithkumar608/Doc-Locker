'use client';

import { usePageInView } from "framer-motion";
import { 
    Award, 
    CreditCard, 
    FileText, 
    Home, 
    Search } from "lucide-react";

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
    const pathname = usePageInView

    
  return (
    <div>Sidebar</div>
  )
}
