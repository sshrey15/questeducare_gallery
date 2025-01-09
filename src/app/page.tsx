"use client"
import React, { useState, useEffect } from 'react';
import TopCarousel from './components/TopCarousel';
import BottomCarousel from './components/BottonCarousel';
import MasonryGrid from './components/MasonryGrid';
import { MdEdit } from "react-icons/md";
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import Link from 'next/link';

const ImageCarousel = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    NProgress.start();
    const timer = setTimeout(() => {
      setLoading(false);
      NProgress.done();
    }, 3000);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <AnimatePresence>
        {loading ? (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed bg-[url('/sci.avif')] bg-fixed bg-center bg-[length:20%] opacity-20 top-0 left-0 w-full h-full bg-white z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.5,
                ease: "easeOut"
              }}
              className="relative w-32 h-32 flex items-center justify-center"
            >
              <Image
                src="/quest.png"
                alt="Logo"
                width={128}
                height={128}
                className="object-contain bg-blue-800"
                priority
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full"
      >
        {/* Background with improved contrast */}
        <div className="fixed top-0 left-0 w-full h-full z-0">
          <div 
            className="w-full h-full bg-[url('/sci.avif')] bg-fixed bg-center bg-[length:20%] opacity-40"
          />
        </div>

        {/* Edit button */}
        <div className="absolute top-4 right-4 z-20">
        <Link href="/edit">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            
            <MdEdit className="h-6 w-6 text-gray-700" />
            
          </motion.button>
          </Link>
        </div>

        {/* Main content */}
        <div className="relative z-10 w-full pb-16"> {/* Add padding to the bottom */}
          <MasonryGrid />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="py-8"
          >
            <TopCarousel />
            <motion.h1 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.5 }}
  className="text-center text-4xl font-bold my-8 font-content"
>
  Come make <span className="text-blue-500">memories</span>
</motion.h1>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-center text-4xl font-bold my-8 font-content"
            >
              with us!
            </motion.h1>
          </motion.div>
          <BottomCarousel />
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full text-center text-gray-600 z-30">
        <p>Made with <span className="text-red-500">❤️</span> from Questeducare</p>
      </footer>
    </div>
  );
};

export default ImageCarousel;