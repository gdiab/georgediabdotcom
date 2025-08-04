'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navigation() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <nav className="hidden lg:flex lg:flex-col lg:h-full lg:bg-gray-900">
        <div className="flex flex-col flex-1 p-8">
          {/* Logo */}
          <div className="mb-12">
            <Link href="/" className="text-3xl font-yanone font-bold text-white hover:text-gray-300 transition-colors">
              George Diab
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1">
            <div className="space-y-6">
              <Link 
                href="/" 
                className="block text-lg text-gray-300 hover:text-white transition-colors font-medium"
              >
                Home
              </Link>
              <Link 
                href="/blog" 
                className="block text-lg text-gray-300 hover:text-white transition-colors font-medium"
              >
                Blog
              </Link>
              <Link 
                href="/about" 
                className="block text-lg text-gray-300 hover:text-white transition-colors font-medium"
              >
                About
              </Link>
            </div>
          </nav>

          {/* Auth Section */}
          <div className="mt-auto pt-8 border-t border-gray-800">
            {status === 'loading' ? (
              <div className="animate-pulse bg-gray-700 h-8 w-24 rounded"></div>
            ) : session ? (
              <div className="space-y-4">
                {session.user?.email === 'george.diablo@gmail.com' && (
                  <Link
                    href="/dashboard"
                    className="block bg-white text-black px-4 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors text-center"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="block text-gray-400 hover:text-white text-sm transition-colors w-full text-left"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="block bg-white text-black px-4 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors w-full text-center"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden bg-gray-900 border-b border-gray-800">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-xl font-yanone font-bold text-white">
                George Diab
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="border-t border-gray-800">
            <div className="px-4 pt-4 pb-6 space-y-4">
              <Link 
                href="/" 
                className="block text-lg text-gray-300 hover:text-white font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/blog" 
                className="block text-lg text-gray-300 hover:text-white font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                href="/about" 
                className="block text-lg text-gray-300 hover:text-white font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              {/* Mobile Auth */}
              <div className="pt-4 border-t border-gray-800">
                {status === 'loading' ? (
                  <div className="animate-pulse bg-gray-700 h-8 w-24 rounded"></div>
                ) : session ? (
                  <div className="space-y-3">
                    {session.user?.email === 'george.diablo@gmail.com' && (
                      <Link
                        href="/dashboard"
                        className="block bg-white text-black px-4 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors text-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="block text-gray-400 hover:text-white text-sm w-full text-left"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      signIn('google');
                      setIsMenuOpen(false);
                    }}
                    className="block bg-white text-black px-4 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors w-full text-center"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}