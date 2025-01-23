"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

type GalleryImage = {
  id: string;
  title: string;
  images: string[];
};

const MasonryGrid = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [likedImages, setLikedImages] = useState<{ [id: string]: number }>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    NProgress.start();
    const fetchImages = async () => {
      try {
        const response = await fetch("https://questeducare-gallery.vercel.app/api/imagemanager");
        const data = await response.json();

        if (response.ok && data.message === "success") {
          setImages(data.data);
          const savedLikes = localStorage.getItem("imageLikes");
          setLikedImages(savedLikes ? JSON.parse(savedLikes) : {});
        } else {
          setError(data.error || "Failed to fetch images");
        }
      } catch (err) {
        setError("Failed to fetch images");
        console.error("Error fetching images:", err);
      } finally {
        setLoading(false);
        NProgress.done();
      }
    };

    fetchImages();
  }, []);

  const handleLikeToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening when clicking like button
    setLikedImages((prev) => {
      const newLikes = {
        ...prev,
        [id]: (prev[id] || 0) + 1,
      };
      localStorage.setItem("imageLikes", JSON.stringify(newLikes));
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-500">
        {error}
      </div>
    );
  }

  const allImages = images.reduce(
    (acc: { id: string; src: string }[], gallery) => [
      ...acc,
      ...gallery.images.map((src) => ({ id: gallery.id, src })),
    ],
    []
  );

  return (
    <>
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {allImages.map(({ id, src }, index) => (
          <motion.div
            key={id + index}
            className="relative aspect-square cursor-pointer group"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => setSelectedImage(src)}
          >
            <Image
              src={src}
              alt={`Gallery image ${index + 1}`}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            />
            {hoveredIndex === index && (
              <motion.div
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <button
                  onClick={(e) => handleLikeToggle(id, e)}
                  className="text-white bg-black p-2 rounded-full"
                >
                  ❤️ {likedImages[id] || 0}
                </button>
              </motion.div>
            )}
          </motion.div>
        ))}
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
              className="relative max-w-7xl w-full max-h-[90vh] bg-gray-100 rounded-xl overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-[80vh]">
                <Image
                  src={selectedImage}
                  alt="Full size image"
                  fill
                  className="object-contain"
                />
              </div>
              <button
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
                onClick={() => setSelectedImage(null)}
              >
                ❌
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MasonryGrid;
