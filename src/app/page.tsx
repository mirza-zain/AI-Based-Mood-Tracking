'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isSignUp, setIsSignUp] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const endpoint = isSignUp ? "/api/auth/register" : "/api/auth/login"
    const payload = isSignUp ? { name, email, password } : { email, password }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      // Successful auth, redirect to journal
      router.push("/journal")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp)
    setError("")
    setName("")
    setEmail("")
    setPassword("")
  }

  return (
    <div className="relative min-h-screen bg-[#0d0f14] overflow-hidden flex flex-col items-center justify-center font-sans antialiased text-white px-4">
      {/* Background blobs for premium glassmorphism effect */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

      {/* Main Hero Container */}
      <div className="relative z-10 w-full max-w-[640px] text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/25 bg-blue-500/5 text-blue-400 text-xs font-semibold tracking-wide uppercase">
          ✨ Next-Gen Mood Analysis
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 leading-tight">
          The best journal app,<br />Period.
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 font-normal leading-relaxed max-w-[500px] mx-auto">
          Understand yourself better by tracking your mood through natural language. Just journal honestly, and let AI analyze the trends.
        </p>

        <div className="pt-4">
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Auth Modal Backdrop */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          {/* Modal Container */}
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#161922] p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-left">
            
            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Title */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">
                {isSignUp ? "Create an account" : "Welcome back"}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {isSignUp ? "Sign up to start tracking your mood" : "Log in to view your entries"}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-sm font-medium animate-in slide-in-from-top-1">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#0d0f14] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#0d0f14] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#0d0f14] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-[0.98] disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  isSignUp ? "Sign Up" : "Log In"
                )}
              </button>
            </form>

            {/* Toggle Link */}
            <div className="mt-6 text-center text-sm text-gray-400">
              {isSignUp ? "Already have an account?" : "New to Mood Tracker?"}{" "}
              <button
                onClick={toggleAuthMode}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors focus:outline-none"
              >
                {isSignUp ? "Log in instead" : "Sign up instead"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
