import { PropsWithChildren } from "react";
import { getUserByClerkID } from "../../../utilis/auth"
import UserMenu from "../../components/UserMenu"
import Sidebar from "../../components/Sidebar"

const DashboardLayout = async ({children}: PropsWithChildren) => {
    const user = await getUserByClerkID()

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-gray-50/30">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="h-16 border-b border-gray-200/50 bg-white flex items-center justify-between px-8 shadow-sm z-10">
                    <h2 className="text-xl font-bold text-gray-800">
                    </h2>
                    <div>
                        {user && <UserMenu user={{ name: user.name, email: user.email }} />}
                    </div>  
                </header>
                <main className="flex-1 overflow-auto bg-gray-50/50">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout