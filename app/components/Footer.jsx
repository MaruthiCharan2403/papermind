"use client"
import Link from "next/link"
import { Brain } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-10">
            <div className="max-w-6xl mx-auto px-6">
                {/* Top Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 md:gap-20">
                    {/* Logo and Description */}
                    <div className="flex-1">
                        <div className="flex items-center mb-3">
                            <Brain className="h-8 w-8 text-blue-400" />
                            <span className="ml-2 text-xl font-bold">PaperMind</span>
                        </div>
                        <p className="text-gray-400 text-sm max-w-md">
                            Making research papers accessible to everyone through AI-powered understanding.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex gap-12">
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Company</h3>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li>
                                    <Link href="/home" className="hover:text-white transition">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about" className="hover:text-white transition">
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/services" className="hover:text-white transition">
                                        Services
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
                    <p>&copy; 2025 PaperMind. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
