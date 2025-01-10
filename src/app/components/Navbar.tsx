import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white bg-opacity-90 backdrop-blur-sm shadow-sm z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <Link href="/">
            <div className="text-2xl sm:text-3xl font-bold text-gray-800 font-content">
              Questeducare <span className="text-blue-500">Gallery</span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;