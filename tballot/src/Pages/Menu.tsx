import { Card } from "@/components/ui/8bit/card";
import { Button } from "@/components/ui/8bit/button";
import { Home, User, List, Boxes, Menu as MenuIcon, X, ToggleLeft } from "lucide-react";
import { Separator } from "@/components/ui/8bit/separator";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/8bit/toast";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from "react";


export default function Menu() {
    let Navigate = useNavigate();
    let location = useLocation();
    let email = location.state?.email || localStorage.getItem("userEmail");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
            >
                {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>

            {/* Sidebar */}
            <Card className={`fixed lg:static inset-y-0 left-0 z-40 w-64 sm:w-72 bg-white border-r border-gray-300 flex flex-col transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}>
                <div className="flex justify-center text-xl sm:text-2xl font-bold border-b border-gray-300 p-4">
                    Menu
                </div>
                <nav className="flex-1 space-y-2 sm:space-y-3 p-2 sm:p-4 overflow-y-auto">
                    <Button variant="ghost" className="w-full justify-start gap-2 sm:gap-3 text-sm sm:text-base" onClick={() => { Navigate("/menu/dashboard"); setIsMobileMenuOpen(false); }}>
                        <Home size={24} className="sm:w-8 sm:h-8" /> Dashboard
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2 sm:gap-3 text-sm sm:text-base" onClick={() => { Navigate("/menu/candidate-list"); setIsMobileMenuOpen(false); }}>
                        <User size={24} className="sm:w-10 sm:h-10" /> c-Register
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2 sm:gap-3 text-sm sm:text-base" onClick={() => { Navigate("/menu/voter-list"); setIsMobileMenuOpen(false); }}>
                        <List size={18} /> Voter List
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2 sm:gap-3 text-sm sm:text-base" onClick={() => { Navigate("/menu/register"); setIsMobileMenuOpen(false); }}>
                        <Boxes size={20} />v-Register
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2 sm:gap-3 text-sm sm:text-base" onClick={() => { Navigate("/toggle"); setIsMobileMenuOpen(false); }}>
                        <ToggleLeft size={20} />Toggle Election
                    </Button>
                </nav>
                <div className="p-4 sm:p-6 border-t border-gray-300">
                    <Button className="w-full p-4 sm:p-7 cursor-pointer text-sm sm:text-base" variant="destructive" onClick={() => { localStorage.removeItem("userEmail"); toast("You Logout!"); Navigate("/") }}>
                        Logout
                    </Button>
                </div>
            </Card>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 p-2 sm:p-4 lg:ml-0">
                <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 mb-4">
                    <h1 className="hidden md:block font-bold press-start-2p-regular break-all">
                        {email}
                    </h1>
                    <div className="flex  justify-end ">
                        <ConnectButton />
                    </div>
                </div>
                <Separator />
                <Outlet />
            </div>
        </div>
    );
}
