import { User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useAuthStore, { type AuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router";

export function Navbar() {
    const { user } = useAuthStore() as AuthStore;
    const navigate = useNavigate();
    return (
        <header className={`text-white fixed top-0 left-0 w-full shadow transition-transform duration-300 z-50 px-4 bg-black outline-2 outline-gray-800`}>
            <div className="flex h-16 items-center w-full poppins-regular">
                <div className="mr-4 flex">
                    <div onClick={()=> user ? navigate("/dashboard"): navigate("/")} className="mr-6 flex items-center space-x-2">
                        <span className="font-bold ">Image Drive</span>
                    </div>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-2">
                    <nav className="flex items-center space-x-1">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild className="bg-gray-900">
                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                    <User className="h-4 w-4" />
                                    <span className="sr-only">Toggle user menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-gray-900 text-white">
                                
                                {user ?<DropdownMenuItem onClick={()=>{
                                    window.location.href = "/logout"
                                }}>Logout</DropdownMenuItem> : <><DropdownMenuItem onClick={()=>{
                                    window.location.href = "/login"
                                }}>Login</DropdownMenuItem>
                                <DropdownMenuItem onClick={()=>{
                                    window.location.href = "/signup"
                                }}>Sign Up</DropdownMenuItem></>}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>
                </div>
            </div>
        </header>
    )
}