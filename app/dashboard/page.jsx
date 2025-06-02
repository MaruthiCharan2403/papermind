import Footer from "../components/Footer"
import Navbar from "../components/LoginNavbar"

export default function page() {
  return (
    <div>
        <Navbar />
        <section className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
                Welcome to the Dashboard
            </h1>
            <p className="text-lg text-gray-700 text-center mb-8">
                Here you can manage your account, view your data, and more.
            </p>
            </div>
        </section>
        <Footer />
    </div>
  )
}
