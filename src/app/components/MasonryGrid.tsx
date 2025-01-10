"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

type GalleryImage = {
  title: string;
  images: string[];
};

const MasonryGrid = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [likedImages, setLikedImages] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    NProgress.start();
    const fetchImages = async () => {
      try {
        const response = await fetch('https://questeducare-gallery.vercel.app/api/imagemanager');
        console.log('Response:', response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Data:', data);
        
        if (data.message === "success") {
          setImages(data.data);
          // Initialize like counts from localStorage or default to empty object
          const savedLikes = localStorage.getItem('imageLikes');
          setLikedImages(savedLikes ? JSON.parse(savedLikes) : {});
        } else {
          setError(data.error || 'Failed to fetch images');
        }
      } catch (err) {
        setError('Failed to fetch images');
        console.error('Error fetching images:', err);
      } finally {
        NProgress.done();
      }
    };

    fetchImages();
  }, []);

  const handleLikeToggle = (index: number) => {
    setLikedImages(prev => {
      const newLikes = {
        ...prev,
        [index]: (prev[index] || 0) + 1
      };
      // Save to localStorage
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

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-500">
        {error}
      </div>
    );
  }

  const allImages = images.reduce((acc: string[], curr) => [...acc, ...curr.images], []);

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-8 space-y-8">
        {allImages.map((imageUrl, index) => (
          <motion.div
            key={index}
            className="relative break-inside-avoid group mb-8"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            animate={floatingAnimation}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative overflow-hidden rounded-xl bg-white">
              <div className="relative transform transition-transform duration-300">
                <Image
                  src={imageUrl}
                  width={300}
                  height={400}
                  alt={`Image ${index + 1}`}
                  className="w-full h-auto object-cover"
                />
                {/* Hover overlay */}
                <motion.div
                  className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                  animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                />
              </div>

              {/* Like Button with Counter */}
              <div className="absolute top-2 right-2 flex flex-col items-center">
                <motion.button
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  onClick={() => handleLikeToggle(index)}
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
                {/* Like Counter */}
                <motion.span 
                  className="text-xs font-semibold bg-white px-2 py-1 rounded-full shadow-sm mt-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: likedImages[index] ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {likedImages[index] || 0}
                </motion.span>
              </div>

              {/* Shadow Animation */}
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
  );
};

export default MasonryGrid;