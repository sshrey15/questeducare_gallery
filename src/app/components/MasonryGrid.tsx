"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

type GalleryImage = {
  title: string;
  images: string[];
};

const MasonryGrid = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [likedImages, setLikedImages] = useState<{ [key: number]: number }>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    NProgress.start();
    const fetchImages = async () => {
      try {
        const response = await fetch('https://questeducare-gallery.vercel.app/api/imagemanager');
        console.log("RESPONSE: ", response)
        const data = await response.json();
        
        if (response.ok && data.message === "success") {
          setImages(data.data);
          const savedLikes = localStorage.getItem('imageLikes');
          setLikedImages(savedLikes ? JSON.parse(savedLikes) : {});
        } else {
          setError(data.error || 'Failed to fetch images');
        }
      } catch (err) {
        setError('Failed to fetch images');
        console.error('Error fetching images:', err);
      } finally {
        setLoading(false);
        NProgress.done();
      }
    };

    fetchImages();
  }, []);

  const handleLikeToggle = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening when clicking like button
    setLikedImages(prev => {
      const newLikes = {
        ...prev,
        [index]: (prev[index] || 0) + 1
      };
      localStorage.setItem('imageLikes', JSON.stringify(newLikes));
      return newLikes;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const floatingAnimation = {
    y: [-5, 5],
    transition: {
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  };

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
      <div className="flex justify-center items-center min-h-[400px] text-red-500">
        {error}
      </div>
    );
  }

  const allImages = images.reduce((acc: string[], curr) => [...acc, ...curr.images], []);

  return (
    <>
      <motion.div
        className="max-w-7xl mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allImages.map((imageUrl, index) => (
            <motion.div
              key={index}
              className="relative break-inside-avoid group mb-8 cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              animate={floatingAnimation}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setSelectedImage(imageUrl)}
            >
              <div className="relative overflow-hidden rounded-xl bg-white aspect-[1]">
                <div className="relative h-full w-full transform transition-transform duration-300">
                  <Image
                    src={imageUrl}
                    alt={`Image ${index + 1}`}
                    layout="fill"
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <motion.div
                    className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                    animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                  />
                </div>

                <div className="absolute top-2 right-2 flex flex-col items-center">
                  <motion.button
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    onClick={(e) => handleLikeToggle(index, e)}
                    whileTap={{ scale: 0.8 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={likedImages[index] ? "red" : "none"}
                      stroke="currentColor"
                      strokeWidth={2}
                      className="w-5 h-5 text-red-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                      />
                    </svg>
                  </motion.button>
                  <motion.span 
                    className="text-xs font-semibold bg-white px-2 py-1 rounded-full shadow-sm mt-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: likedImages[index] ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {likedImages[index] || 0}
                  </motion.span>
                </div>

                <motion.div
                  className="absolute inset-0 rounded-2xl shadow-lg"
                  animate={{
                    boxShadow:
                      hoveredIndex === index
                        ? "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
                        : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-w-7xl w-full max-h-[90vh] bg-gray-100 opacity-0 rounded-xl overflow-hidden"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative  h-[80vh]">
                <Image
                  src={selectedImage}
                  alt="Full size image"
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              <button
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setSelectedImage(null)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              
              
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MasonryGrid;