'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container-modern py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div>
            <Link 
              href="/" 
              className="heading-lg mb-0 link-primary hover:text-blue-300 transition-colors"
            >
              George Diab
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`transition-colors ${
                isActive('/') && pathname === '/'
                  ? 'text-blue-400 font-medium' 
                  : 'text-gray-400 hover:text-gray-100'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/blog" 
              className={`transition-colors ${
                isActive('/blog')
                  ? 'text-blue-400 font-medium' 
                  : 'text-gray-400 hover:text-gray-100'
              }`}
            >
              Writing
            </Link>
            <Link 
              href="/about" 
              className={`transition-colors ${
                isActive('/about')
                  ? 'text-blue-400 font-medium' 
                  : 'text-gray-400 hover:text-gray-100'
              }`}
            >
              About
            </Link>
            {session?.user?.email === 'george.diablo@gmail.com' && (
              <Link 
                href="/dashboard" 
                className={`transition-colors ${
                  isActive('/dashboard')
                    ? 'text-blue-400 font-medium' 
                    : 'text-gray-400 hover:text-gray-100'
                }`}
              >
                Dashboard
              </Link>
            )}
            {!session && (
              <button
                onClick={() => signIn('google')}
                className="btn btn-secondary text-sm"
              >
                Sign In
              </button>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className="text-gray-400 hover:text-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}