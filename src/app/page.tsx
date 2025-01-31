"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MdEdit, MdOutlinePhotoLibrary } from "react-icons/md";
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
        const response = await fetch("/api/imagemanager");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data); // Log the response data
    
        if (data.message === "success") {
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

      <div className="relative z-10 w-full pb-16 px-4 sm:px-6 lg:px-8 mt-10">
        {/* Galleries List */}
        <div className="max-w-6xl mx-auto space-y-6">
          {galleries.map((gallery) => (
            <motion.div
              key={gallery.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              {/* Header */}
              <div className="px-4 py-3 flex justify-between items-center border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">
                  {gallery.title}
                </h3>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    {gallery.images.length} items
                  </span>
                  <Link href={`/gallery/${gallery.id}`}>
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      View All
                    </button>
                  </Link>
                </div>
              </div>

              {/* Images Row */}
              <div className="p-4">
                <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                  {gallery.images.slice(0, 4).map((image, idx) => (
                    <div
                      key={idx}
                      className="relative w-64 h-48 flex-shrink-0 rounded-lg overflow-hidden"
                    >
                      <Image
                        src={image}
                        alt={`Gallery image ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                  {gallery.images.length > 4 && (
                    <div className="relative w-64 h-48 flex-shrink-0 rounded-lg overflow-hidden">
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <Link href={`/gallery/${gallery.id}`}>
                          <div className="text-white text-center cursor-pointer">
                            <MdOutlinePhotoLibrary className="w-8 h-8 mx-auto mb-2" />
                            <p className="font-medium">
                              +{gallery.images.length - 4} more
                            </p>
                          </div>
                        </Link>
                      </div>
                      <Image
                        src={gallery.images[4]}
                        alt="More images preview"
                        fill
                        className="object-cover opacity-40"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
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

      {/* Custom CSS for hiding scrollbar */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default GalleriesPage;