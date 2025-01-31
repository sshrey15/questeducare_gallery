"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";

interface GalleryImage {
  id: string;
  title: string;
  images: string[];
}

interface EditComponentProps {
  initialImages?: GalleryImage[];
}

const EditComponent: React.FC<EditComponentProps> = ({ initialImages = [] }) => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(initialImages);
  const [selectedImages, setSelectedImages] = useState<Map<string, Set<string>>>(new Map());
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);

  const fetchGalleryImages = async () => {
    setIsLoadingGallery(true);
    try {
      const endpoint = "/api/imagemanager"; // Use relative URL
      const response = await fetch(endpoint);
      const data = await response.json();

      if (response.ok && data.message === "success") {
        setGalleryImages(data.data);
      } else {
        console.error("Error fetching gallery images:", data.error);
      }
    } catch (error) {
      console.error("Fetch gallery images failed:", error);
    } finally {
      setIsLoadingGallery(false);
    }
  };

  useEffect(() => {
    if (initialImages.length === 0) {
      fetchGalleryImages();
    }
  }, [initialImages.length]);

  const toggleImageSelection = (galleryId: string, imageUrl: string) => {
    setSelectedImages(prev => {
      const newSelection = new Map(prev);
      const gallerySelection = new Set(prev.get(galleryId) || []);
      
      if (gallerySelection.has(imageUrl)) {
        gallerySelection.delete(imageUrl);
      } else {
        gallerySelection.add(imageUrl);
      }
      
      if (gallerySelection.size > 0) {
        newSelection.set(galleryId, gallerySelection);
      } else {
        newSelection.delete(galleryId);
      }
      
      return newSelection;
    });
  };

  const handleDelete = async (galleryId: string) => {
    const imagesToDelete = Array.from(selectedImages.get(galleryId) || []);
    if (imagesToDelete.length === 0) return;

    setIsDeleting(true);
    try {
      const response = await fetch('/api/imagemanager', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          galleryId,
          imagesToDelete,
        }),
      });

      if (!response.ok) throw new Error('Failed to delete images');

      // Clear selections for this gallery
      setSelectedImages(prev => {
        const newSelection = new Map(prev);
        newSelection.delete(galleryId);
        return newSelection;
      });

      // Refresh gallery data
      await fetchGalleryImages();
    } catch (error) {
      console.error('Error deleting images:', error);
      alert('Failed to delete images. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 bg-gray-50">
      {isLoadingGallery ? (
        <div className="flex flex-col items-center justify-center h-60 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <div className="relative w-10 h-10">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full animate-spin border-t-blue-500"/>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading your gallery...</p>
        </div>
      ) : galleryImages.length > 0 ? (
        <div className="space-y-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-6 space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">Image Gallery</h2>
            <p className="text-gray-600">
              {galleryImages.length} Collection{galleryImages.length !== 1 ? 's' : ''} • 
              {galleryImages.reduce((acc, gallery) => acc + gallery.images.length, 0)} Total Image{galleryImages.reduce((acc, gallery) => acc + gallery.images.length, 0) !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((gallery) => (
              <div
                key={gallery.id}
                className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 overflow-hidden hover:border-gray-400 transition-colors duration-300"
              >
                <div className="p-2 border-b border-dashed border-gray-300">
                  <h3 className="font-medium text-gray-800">{gallery.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {gallery.images.length} image{gallery.images.length !== 1 ? 's' : ''} •{' '}
                    {selectedImages.get(gallery.id)?.size || 0} selected
                  </p>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {gallery.images.map((image, imgIndex) => (
                      <div
                        key={imgIndex}
                        className="relative group cursor-pointer"
                        onClick={() => toggleImageSelection(gallery.id, image)}
                      >
                        <div className="relative pb-[100%] border border-dashed border-gray-300 rounded-lg overflow-hidden">
                          <div className={`absolute inset-0 z-10 bg-black/50 transition-opacity duration-200 ${
                            selectedImages.get(gallery.id)?.has(image) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center ${
                                selectedImages.get(gallery.id)?.has(image) ? 'border-blue-500 bg-blue-500' : 'border-white'
                              }`}>
                                {selectedImages.get(gallery.id)?.has(image) && (
                                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            </div>
                          </div>
                          <Image
                            fill
                            src={image}
                            alt={`${gallery.title} - Image ${imgIndex + 1}`}
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 border-t border-dashed border-gray-300 flex justify-between items-center">
                  <button
                    onClick={() => handleDelete(gallery.id)}
                    disabled={isDeleting || !((selectedImages.get(gallery.id)?.size ?? 0) > 0)}
                    className={`flex items-center px-4 py-2 rounded-md ${
                      isDeleting || !((selectedImages.get(gallery.id)?.size ?? 0) > 0)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Selected'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <svg className="w-full h-full text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Images Available</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Your gallery is empty. Start by uploading some images in the New Upload tab.
          </p>
        </div>
      )}
    </div>
  );
};

export default EditComponent;