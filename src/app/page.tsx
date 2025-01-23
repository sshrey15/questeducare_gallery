"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MdFolderOpen, MdEdit } from "react-icons/md";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import TopCarousel from "./components/TopCarousel";
import BottomCarousel from "./components/BottonCarousel";

type GalleryFolder = {
  id: string;
  title: string;
  images: string[];
};

const GalleriesPage = () => {
  const [galleries, setGalleries] = useState<GalleryFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    NProgress.start();
    const fetchGalleries = async () => {
      try {
        const response = await fetch("https://questeducare-gallery.vercel.app/api/imagemanager");
        const data = await response.json();

        if (response.ok && data.message === "success") {
          setGalleries(data.data);
        } else {
          setError(data.error || "Failed to fetch galleries");
        }
      } catch (err) {
        setError("Failed to fetch galleries");
        console.error("Error fetching galleries:", err);
      } finally {
        setLoading(false);
        NProgress.done();
      }
    };

    fetchGalleries();
  }, []);

  if (loading) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed bg-[url('/sci.avif')] bg-fixed bg-center bg-cover sm:bg-[length:20%] opacity-20 top-0 left-0 w-full h-full bg-white z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center"
          >
            <Image
              src="/logoquest.jpg"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden pt-16">
      {/* Edit Icon */}
      <div className="absolute top-4 right-4 z-50">
        <Link href="/edit">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 sm:w-12 sm:h-12 relative cursor-pointer flex items-center justify-center rounded-full bg-white shadow-lg"
          >
            <MdEdit className="text-blue-500 w-6 h-6" />
          </motion.div>
        </Link>
      </div>

      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <div className="w-full h-full bg-[url('/sci.avif')] bg-fixed bg-center bg-cover sm:bg-[length:20%] opacity-40" />
      </div>

      <div className="relative z-10 w-full pb-16 px-2 sm:px-4 mt-10">
        {/* Galleries Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-6 mb-8"
        >
          {galleries.map((gallery) => (
            <Link href={`/gallery/${gallery.id}`} key={gallery.id}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-64 h-48 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
              >
                {/* Folder Tab */}
                <div className="absolute left-4 w-48 h-6 bg-blue-500 rounded-b-lg shadow-md z-10 flex items-center px-2">
                  <MdFolderOpen className="h-4 w-4 text-white mr-2" />
                  <span className="text-xs text-white font-medium w-full overflow-hidden whitespace-nowrap text-ellipsis">
                    {gallery.title}
                  </span>
                </div>

                {/* Thumbnail Grid */}
                <div className="grid grid-cols-3 gap-1 p-2 pt-8 bg-gray-50 h-full">
                  {gallery.images.slice(0, 6).map((image, idx) => (
                    <div key={idx} className="w-full h-16 relative">
                      <Image
                        src={image}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover rounded-sm"
                        sizes="(max-width: 640px) 33vw, 20vw"
                      />
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-1 text-center">
                  <p className="text-xs text-gray-600 font-medium">
                    {gallery.images.length} images
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>

      <TopCarousel />
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center text-2xl sm:text-3xl md:text-4xl font-bold my-4 sm:my-8 font-content"
      >
        Come make <span className="text-blue-500">memories</span> with us!
      </motion.h1>
      <BottomCarousel />

      {/* Footer */}
      <footer className="fixed bottom-0 w-full py-2 sm:py-3 bg-white bg-opacity-90 text-center text-gray-600 z-30 text-sm sm:text-base">
        <p>
          Made with <span className="text-red-500">❤️</span> from Questeducare
        </p>
      </footer>
    </div>
  );
};

export default GalleriesPage;