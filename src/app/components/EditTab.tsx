"use client"
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import Modal from "./Modal"; // Import the Modal component

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
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newImages, setNewImages] = useState<{ preview: string; file: File }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentGalleryIdRef = useRef<string>("");

  const fetchGalleryImages = async () => {
    setIsLoadingGallery(true);
    try {
      const endpoint = "/api/imagemanager";
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

      setSelectedImages(prev => {
        const newSelection = new Map(prev);
        newSelection.delete(galleryId);
        return newSelection;
      });

      await fetchGalleryImages();
    } catch (error) {
      console.error('Error deleting images:', error);
      alert('Failed to delete images. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddImages = (galleryId: string) => {
    currentGalleryIdRef.current = galleryId;
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const newImages = files.map((file) => ({
      preview: URL.createObjectURL(file),
      file: file,
    }));
    setNewImages((prevImages) => [...prevImages, ...newImages]);
  };

  const convertToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUploadImages = async () => {
    const galleryId = currentGalleryIdRef.current;
    if (!galleryId || newImages.length === 0) return;

    setIsUploading(true);
    try {
      const base64Images = await Promise.all(newImages.map((image) => convertToBase64(image.file)));

      // Send the gallery ID and new image URLs to your API endpoint
      const response = await fetch('/api/updateGallery', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: galleryId,
          images: base64Images,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update gallery');
      }

      // Refresh the gallery
      await fetchGalleryImages();
      
      // Clear the file input and close the modal
      setNewImages([]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 bg-gray-50">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
      />
      
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
                <div className="p-2 border-b border-dashed border-gray-300 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800">{gallery.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {gallery.images.length} image{gallery.images.length !== 1 ? 's' : ''} •{' '}
                      {selectedImages.get(gallery.id)?.size || 0} selected
                    </p>
                  </div>
                  <button
                    onClick={() => handleAddImages(gallery.id)}
                    disabled={isUploading}
                    className={`p-2 rounded-full transition-colors duration-200 ${
                      isUploading 
                        ? 'bg-gray-100 cursor-not-allowed' 
                        : 'hover:bg-gray-200'
                    }`}
                    title="Add images to gallery"
                  >
                    <Plus className={`w-5 h-5 ${isUploading ? 'text-gray-400' : 'text-gray-600'}`} />
                  </button>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Images Available</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Your gallery is empty. Start by uploading some images in the New Upload tab.
          </p>
        </div>
      )}

      {/* Modal for uploading and previewing new images */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload New Images</h2>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="mb-4"
        />
        <div className="grid grid-cols-2 gap-4 mb-4">
          {newImages.map((image, index) => (
            <div key={index} className="relative w-full h-32 border border-dashed border-gray-300 rounded-lg overflow-hidden">
              <Image
                src={image.preview}
                alt={`New Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleUploadImages}
          disabled={isUploading}
          className={`w-full py-2 rounded-md text-white ${isUploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isUploading ? 'Uploading...' : 'Upload Images'}
        </button>
      </Modal>
    </div>
  );
};

export default EditComponent;