'use client';

import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
      {/* Fixed Sidebar - Hidden on mobile */}
      <div className="hidden lg:flex lg:flex-col lg:w-80 lg:fixed lg:inset-y-0" style={{ backgroundColor: '#18181b', borderRight: '1px solid #27272a' }}>
        <div className="flex flex-col flex-1 min-h-0">
          {/* Navigation */}
          <Navigation />
          
          {/* Footer in sidebar - only on desktop */}
          <div className="mt-auto">
            <Footer />
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Shows only on mobile */}
      <div className="lg:hidden">
        <Navigation />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 lg:pl-80" style={{ backgroundColor: '#000000' }}>
        {/* Content Area */}
        <main className="flex-1 min-h-screen">
          {children}
        </main>
        
        {/* Footer for mobile - only shows on mobile */}
        <div className="lg:hidden">
          <Footer />
        </div>
      </div>
    </div>
  );
}