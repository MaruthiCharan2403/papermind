"use client"
import Link from "next/link"
import { Brain, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Navbar() {
  const router = useRouter()
  const [username, setUsername] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = sessionStorage.getItem("username")
      setUsername(storedUser || "")
    }
  }, [])

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    router.push('/login');
  }

  return (
    <div>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">PaperMind</span>
            </div>
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
            <div className="flex items-center space-x-4">
              {/* User Icon and Name */}
              {username && (
                <span className="flex items-center bg-gray-100 px-3 py-1 rounded-md">
                  <User className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-gray-800 text-sm font-medium">{username}</span>
                </span>
              )}
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}