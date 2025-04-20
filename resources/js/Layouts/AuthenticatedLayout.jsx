import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    FiMenu,
    FiX,
    FiHome,
    FiLogOut,
    FiUser,
    FiCreditCard,
    FiList,
    FiBell
} from 'react-icons/fi';

import { FaDoorOpen } from "react-icons/fa";

import { Toaster } from 'react-hot-toast';

export default function SidebarLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Handle responsive behavior
    useEffect(() => {
        const checkScreenSize = () => {
            if (window.innerWidth < 768) {
                setSidebarOpen(false);
                setIsMobile(true);
            } else {
                setSidebarOpen(true);
                setIsMobile(false);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <div
                className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 text-gray-800 transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
            >
                <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
                    <Link href="/" className="flex items-center text-blue-600">
                        <FaDoorOpen className="h-5 w-5" /> <span className="text-xl font-bold">SmartDoor</span>
                    </Link>
                    {isMobile && (
                        <button onClick={toggleSidebar} className="md:hidden">
                            <FiX className="h-6 w-6 text-gray-600" />
                        </button>
                    )}
                </div>

                <div className="border-b border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                            <FiUser className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-800">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                    </div>
                </div>

                <div className="py-4">
                    <nav>
                        <Link
                            href={route('dashboard')}
                            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 ${route().current('dashboard') ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' : ''
                                }`}
                        >
                            <FiHome className="mr-3 h-5 w-5" />
                            <span>Dashboard</span>
                        </Link>

                        <Link
                            href={route('doors.index')}
                            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 ${route().current('doors.*') ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' : ''
                                }`}
                        >
                            <FaDoorOpen className="mr-3 h-5 w-5" />
                            <span>Doors</span>
                        </Link>

                        <Link
                            href={route('cards.index')}
                            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 ${route().current('cards.*') ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' : ''
                                }`}
                        >
                            <FiCreditCard className="mr-3 h-5 w-5" />
                            <span>Cards</span>
                        </Link>

                        <Link
                            href={route('logs.index')}
                            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 ${route().current('logs.*') ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' : ''
                                }`}
                        >
                            <FiList className="mr-3 h-5 w-5" />
                            <span>Logs</span>
                        </Link>
                    </nav>
                </div>

                <div className="absolute bottom-0 w-full border-t border-gray-200">
                    <div className="px-6 py-4">
                        <Link
                            href={route('profile.edit')}
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                        >
                            <FiUser className="mr-3 h-5 w-5" />
                            <span>Profile</span>
                        </Link>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex w-full items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                        >
                            <FiLogOut className="mr-3 h-5 w-5" />
                            <span>Log Out</span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="bg-white shadow-sm">
                    <div className="flex h-16 items-center justify-between px-4">
                        <div className="flex items-center">
                            <button
                                onClick={toggleSidebar}
                                className="text-gray-600 focus:outline-none md:hidden"
                            >
                                <FiMenu className="h-6 w-6" />
                            </button>
                            {header && (
                                <div className="ml-4 md:ml-0">{header}</div>
                            )}
                        </div>
                    </div>
                </header>

                <Toaster
                    position="top-right"
                    toastOptions={{
                        className: "",
                        style: {
                            borderRadius: "8px",
                            background: "#fff",
                            color: "#333",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            padding: "16px",
                        },
                        success: {
                            style: {
                                borderLeft: "4px solid #10b981",
                            },
                        },
                        error: {
                            style: {
                                borderLeft: "4px solid #ef4444",
                            },
                        },
                    }}
                />

                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}