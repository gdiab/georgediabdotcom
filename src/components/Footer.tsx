import React from 'react';
import SocialIcons from './SocialIcons';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-700 bg-gray-800/30">
      <div className="container-modern py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} George Diab. All rights reserved.
          </p>
          <SocialIcons />
        </div>
      </div>
    </footer>
  );
}