"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { MdArrowBack } from "react-icons/md";


type GalleryDetail = {
  id: string;
  title: string;
  images: string[];
};

const GalleryDetailPage = () => {
  const [gallery, setGallery] = useState<GalleryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    NProgress.start();
    const fetchGalleryDetails = async () => {
      try {
        const galleryId = params.id; // Ensure you're accessing the correct galleryId from URL params
        if (!galleryId) {
          setError("Gallery ID is missing");
          return;
        }

        const response = await fetch(
          `https://questeducare-gallery.vercel.app/api/imagemanager/${galleryId}`
        );
        const data = await response.json();

        if (response.ok && data.message === "success") {
          const currentGallery = data.data;
          console.log("current_gallery: ", currentGallery);
          if (currentGallery) {
            setGallery(currentGallery);
          } else {
            setError("Gallery not found");
          }
        } else {
          setError(data.error || "Failed to fetch gallery details");
        }
      } catch (err) {
        setError("Failed to fetch gallery details");
        console.error("Error fetching gallery details:", err);
      } finally {
        setLoading(false);
        NProgress.done();
      }
    };

    fetchGalleryDetails();
  }, [params.galleryId]); // Ensure the API is refetched when galleryId changes

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
      </div>
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
    <>


      <div className="container mx-auto px-4 py-8 mt-10">
              {/* Background */}
     
     {/* Back Button */}
     <div className="flex items-center mb-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center mr-4  p-2 rounded-full transition cursor-pointer"
          >
            <MdArrowBack className="text-black font-xl w-6 h-6" />
            <span className="ml-2 text-3xl font-bold">{gallery?.title}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery?.images.map((imageUrl, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative cursor-pointer"
              onClick={() => setSelectedImage(imageUrl)}
            >
              <Image
                src={imageUrl}
                alt={`Gallery image ${index + 1}`}
                layout="responsive"
                width={100}
                height={100}
                className="object-contain rounded-lg"
              />
            </motion.div>
          ))}
        </div>
      </div>

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
                  layout="fill"
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

export default GalleryDetailPage;