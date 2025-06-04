"use client"
import Link from "next/link"
import { Brain, User, Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Navbar() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = sessionStorage.getItem("username")
      setUsername(storedUser || "")
    }
  }, [])

  const logout = () => {
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("username")
    router.push('/login')
  }

  // Closes mobile menu after navigation or logout
  const handleMobileNav = (cb) => {
    setMobileOpen(false)
    if (cb) cb()
  }

  return (
    <div>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center" onClick={() => router.push('/dashboard')}>
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">PaperMind</span>
            </div>
            {/* Desktop Nav */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <Link
                  href="/upload"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Upload Paper
                </Link>
                <Link
                  href="/papers"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  View Papers
                </Link>
                <Link
                  href="/history"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  History
                </Link>
              </div>
            </div>
            {/* Desktop User & Logout */}
            <div className="hidden md:flex items-center space-x-4">
              {username && (
                <span className="flex items-center bg-gray-100 px-3 py-1 rounded-md">
                  <User className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-gray-800 text-sm font-medium">{username}</span>
                </span>
              )}
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                onClick={logout}
              >
                Logout
              </button>
            </div>
            {/* Mobile hamburger */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
                aria-label="Main menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/dashboard"
                className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => handleMobileNav()}
              >
                Home
              </Link>
              <Link
                href="/upload"
                className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => handleMobileNav()}
              >
                Upload Paper
              </Link>
              <Link
                href="/papers"
                className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => handleMobileNav()}
              >
                View Papers
              </Link>
              <Link
                href="/history"
                className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => handleMobileNav()}
              >
                History
              </Link>
              <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md mt-2">
                {username && (
                  <>
                    <User className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-gray-800 text-base font-medium">{username}</span>
                  </>
                )}
              </div>
              <button
                className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-base font-medium transition-colors"
                onClick={() => handleMobileNav(logout)}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}