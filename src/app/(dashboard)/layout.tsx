import { UserButton } from "@clerk/nextjs"
import Link from "next/link";
import { PropsWithChildren } from "react";

const links = [
    {'href': '/', 'label': 'Home'},
    {'href': '/journal', 'label': 'Journal'},
    {'href': '/history', 'label': 'History'},
]

const DashboardLayout = ({children}: PropsWithChildren) => {
    return (
        <div className="w-screen h-screen relative">
            <aside className="absolute w-[200px] top-0 left-0 h-full border-r border-black/10">
                <div className="px-4 py-4 border-b border-black/10">
                    <h1 className="text-lg font-semibold">Mood</h1>
                </div>
                <ul>
                    {
                        links.map((link) => (
                            <li key={link.href} className="px-4 py-4 text-lg">
                                <Link href={link.href}>
                                    {link.label}
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </aside>
            <div className="ml-[200px] h-full">
                <header className="h-[60px] border-b border-black/10">
                    <div className="h-full w-full px-6 flex items-center justify-end">
                        <UserButton />
                    </div>  
                </header>
                <div className="h-[calc(100vh-60px)]">{children}</div>
            </div>
        </div>
    )
}

export default DashboardLayout