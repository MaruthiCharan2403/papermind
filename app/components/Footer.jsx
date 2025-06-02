import Link from "next/link"
import { Brain } from "lucide-react"
export default function Footer() {
    return (
        <div>
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <Brain className="h-8 w-8 text-blue-400" />
                                <span className="ml-2 text-xl font-bold">PaperMind</span>
                            </div>
                            <p className="text-gray-400">
                                Making research papers accessible to everyone through AI-powered understanding.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Product</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <Link href="/features" className="hover:text-white">
                                        Features
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/pricing" className="hover:text-white">
                                        Pricing
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/demo" className="hover:text-white">
                                        Demo
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Company</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <Link href="/about" className="hover:text-white">
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="hover:text-white">
                                        Contact
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/careers" className="hover:text-white">
                                        Careers
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Support</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <Link href="/help" className="hover:text-white">
                                        Help Center
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy" className="hover:text-white">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="hover:text-white">
                                        Terms of Service
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 PaperMind. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
