import Link from "next/link"
import {
    Brain,
    Users,
    Target,
    Heart,
    Lightbulb,
    Award,
    Globe,
    ArrowRight,
    Quote,
    BookOpen,
    Zap,
    Shield,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useRouter } from "next/navigation"



export default function AboutPage() {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About PaperMind</h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            We're on a mission to democratize access to research knowledge by making complex academic papers
                            understandable for everyone.
                        </p>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                            <div className="space-y-4 text-gray-600">
                                <p> PaperMind was born from a simple frustration: brilliant research was locked away behind walls of academic jargon and complex terminology. Our founders, a group of curious college students, often found themselves intrigued by research papers but unable to make sense of even the abstract. </p>
                                <p> They realized this wasn't just their struggle—millions of students, researchers, and professionals around the world were facing the same barrier. Groundbreaking discoveries were being published every day, but their impact was limited simply because they were too difficult to understand. </p>
                                <p> That’s when they decided to build something different. Using cutting-edge AI technology, they created a platform to bridge the gap between complex research and human understanding—making knowledge accessible to anyone curious enough to explore it. </p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg p-8">
                            <div className="text-center">
                                <Quote className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                                <blockquote className="text-lg text-gray-700 italic mb-4">
                                    "Knowledge should be accessible to everyone, not just those who speak the language of academia."
                                </blockquote>
                                <cite className="text-sm text-gray-600 font-medium">— PaperMind Founder</cite>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="bg-white rounded-lg p-8 shadow-sm">
                            <div className="flex items-center mb-6">
                                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                                    <Target className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                            </div>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                To democratize access to research knowledge by transforming complex academic papers into clear,
                                understandable insights that anyone can access and benefit from, regardless of their academic
                                background.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-8 shadow-sm">
                            <div className="flex items-center mb-6">
                                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                                    <Lightbulb className="h-6 w-6 text-purple-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                            </div>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                A world where groundbreaking research drives innovation across all industries, where students learn
                                faster, and where the collective human knowledge is truly accessible to everyone who seeks to understand
                                it.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
                        <p className="text-lg text-gray-600">The principles that guide everything we do</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Accessibility</h3>
                            <p className="text-gray-600 text-sm">
                                Knowledge should be available to everyone, regardless of their academic background or expertise level.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Shield className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Accuracy</h3>
                            <p className="text-gray-600 text-sm">
                                We maintain the highest standards of accuracy while making complex information understandable.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Zap className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation</h3>
                            <p className="text-gray-600 text-sm">
                                We continuously push the boundaries of AI technology to better serve our users' needs.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Heart className="h-8 w-8 text-orange-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Empathy</h3>
                            <p className="text-gray-600 text-sm">
                                We understand the frustration of not understanding research and build solutions with users in mind.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Stats */}
            <section className="py-16 bg-blue-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Our Impact</h2>
                        <p className="text-xl text-blue-100">Making research accessible, one paper at a time</p>
                    </div>
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">88M+</div>
                            <div className="text-blue-100">Total Papers</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">80%</div>
                            <div className="text-blue-100">Research Papers</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">6%</div>
                            <div className="text-blue-100">Conference Papers</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">5%</div>
                            <div className="text-blue-100">Book Chapters</div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Team Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
                        <p className="text-lg text-gray-600">
                            A diverse group of AI researchers, engineers, and educators united by a common goal
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                            
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Charan</h3>
                            
                            <p className="text-gray-600 text-sm">
                                An Undergraduate Student in Keshav Memorial Institute of Technology.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                            
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Deepak</h3>
                            
                            <p className="text-gray-600 text-sm">
                                An Undergraduate Student in Keshav Memorial Institute of Technology.
                            </p>
                        </div>
                        
                    </div>
                </div>
            </section>

            
            {/* Future Vision */}
            <section className="py-16 bg-gradient-to-br from-indigo-50 to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">The Future We're Building</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            We're just getting started. Here's what we're working on to make research even more accessible
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                <Globe className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Multilingual Support</h3>
                            <p className="text-gray-600 text-sm">
                                Breaking down language barriers to make global research accessible to everyone.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                <Brain className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced AI Models</h3>
                            <p className="text-gray-600 text-sm">
                                Continuously improving our AI to provide even more accurate and nuanced explanations.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Collaborative Research</h3>
                            <p className="text-gray-600 text-sm">
                                Tools for researchers to collaborate and build upon each other's work more effectively.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-blue-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Join Us in Democratizing Research</h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Be part of the movement to make research knowledge accessible to everyone. Start exploring papers like never
                        before.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-lg text-lg font-medium transition-colors flex items-center justify-center" onClick={() => router.push('/login')}>
                            Try PaperMind Free
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </button>
                        
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
