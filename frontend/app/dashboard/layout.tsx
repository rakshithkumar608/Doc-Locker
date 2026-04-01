import { Sidebar }  from "../../components/layouts/Sidebar"
import  { Header } from '../../components/layouts/Header';


export default function DashboardLayout({
    children,
} : {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg=zinc-950">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />

                <main className="flex-1 overflow-auto p-6 bg-zinc-950">
                    {children}
                </main>
            </div>
        </div>
    )
}