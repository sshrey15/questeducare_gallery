"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const images = [
  { src: "/carousel/1.png", width: 300, height: 400 },
  { src: "/carousel/2.png", width: 300, height: 200 },
  { src: "/carousel/3.png", width: 300, height: 300 },
  { src: "/carousel/4.png", width: 300, height: 500 },
  { src: "/carousel/5.png", width: 300, height: 250 },
  { src: "/carousel/6.png", width: 300, height: 350 },
  { src: "/carousel/7.png", width: 300, height: 450 },
  { src: "/carousel/8.png", width: 300, height: 300 },
  { src: "/carousel/9.png", width: 300, height: 400 },
  { src: "/carousel/10.png", width: 300, height: 200 },
  { src: "/carousel/11.png", width: 300, height: 300 },
  { src: "/carousel/12.png", width: 300, height: 500 },
];

const MasonryGrid = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [likedImages, setLikedImages] = useState<boolean[]>(
    Array(images.length).fill(false)
  );

  const handleLikeToggle = (index: number) => {
    setLikedImages((prev) =>
      prev.map((liked, i) => (i === index ? !liked : liked))
    );
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

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-8 space-y-8">
        {images.map((image, index) => (
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
                  src={image.src}
                  width={image.width}
                  height={image.height}
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

              {/* Like Button */}
              <div className="absolute top-2 right-2">
                <motion.button
                  className="p-1 bg-white  rounded-full shadow-md"
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
