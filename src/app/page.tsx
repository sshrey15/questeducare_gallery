"use client";
import React from 'react';
import TopCarousel from './components/TopCarousel';
import BottomCarousel from './components/BottonCarousel';
import MasonryGrid from './components/MasonryGrid';
import { MdEdit } from "react-icons/md";

import { motion } from 'framer-motion';
import Link from 'next/link';

const ImageCarousel = () => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden pt-16"> {/* Added pt-16 for padding */}
      {/* Background image container */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <div 
          className="w-full h-full bg-[url('/sci.avif')] bg-fixed bg-center bg-cover sm:bg-[length:20%] opacity-40"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full"
      >
        {/* Edit button - Responsive positioning */}
        <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-30"> {/* Increased z-index */}
          <Link href="/edit">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <MdEdit className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
            </motion.button>
          </Link>
        </div>

        {/* Main content - Responsive spacing */}
        <div className="relative z-10 w-full pb-16 px-2 sm:px-4"> 
          <MasonryGrid />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="py-4 sm:py-8"
          >
            <TopCarousel />
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center text-2xl sm:text-3xl md:text-4xl font-bold my-4 sm:my-8 font-content"
            >
              Come make <span className="text-blue-500">memories</span>
            </motion.h1>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-center text-2xl sm:text-3xl md:text-4xl font-bold my-4 sm:my-8 font-content"
            >
              with us!
            </motion.h1>
          </motion.div>
          <BottomCarousel />
        </div>
      </motion.div>

      {/* Footer - Responsive positioning and sizing */}
      <footer className="fixed bottom-0 w-full py-2 sm:py-3 bg-white bg-opacity-90 text-center text-gray-600 z-30 text-sm sm:text-base">
        <p>Made with <span className="text-red-500">❤️</span> from Questeducare</p>
      </footer>
    </div>
  );
};

export default ImageCarousel;