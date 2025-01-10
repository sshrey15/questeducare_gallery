"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { MdUpload, MdArrowBack, MdClose } from "react-icons/md";
import { useRouter } from "next/navigation";

interface UploadImage {
  preview: string;
  file: File;
}

interface GalleryImage {
  title: string;
  images: string[];
}

const UploadPage = () => {
  const [images, setImages] = useState<UploadImage[]>([]);
  const [activeTab, setActiveTab] = useState<"new" | "edit">("new");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false); // State for authorization
  const [password, setPassword] = useState(""); // Password input state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(true); // Modal state for password input
  const router = useRouter();

  const correctPassword = "12345"; // Hardcoded password

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthorized(true);
      setIsPasswordModalOpen(false);
    } else {
      alert("Incorrect password!");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const newImages = files.map((file) => ({
      preview: URL.createObjectURL(file),
      file: file,
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => {
      URL.revokeObjectURL(prevImages[index].preview);
      return prevImages.filter((_, i) => i !== index);
    });
  };

  const handleUploadToServer = async () => {
    if (!title.trim()) {
      alert("Please provide a title for the upload.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const convertToBase64 = (file: File) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
    };

    try {
      const base64Images = await Promise.all(
        images.map((image) => convertToBase64(image.file))
      );

      const payload = {
        title,
        images: base64Images,
      };

      const response = await fetch("https://questeducare-gallery.vercel.app/api/imagemanager", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.message === "success") {
        setUploadProgress(100);
        alert("Upload successful!");
        setImages([]);
        setTitle("");
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (error) {
      console.error("Error uploading to server:", error);
      alert("Error uploading images.");
    } finally {
      setIsUploading(false);
    }
  };

  const fetchGalleryImages = async () => {
    setIsLoadingGallery(true);
    try {
      const response = await fetch("https://questeducare-gallery.vercel.app/api/imagemanager");
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
    if (activeTab === "edit" && isAuthorized) {
      fetchGalleryImages();
    }
  }, [activeTab, isAuthorized]);

  useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, []);


  return (
    <div className="relative w-full min-h-screen">

      {/* Background with opacity */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="w-full h-full bg-[url('/sci.avif')] bg-fixed bg-center bg-cover opacity-20" />
      </div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center p-2 sm:p-4 min-h-screen bg-white bg-opacity-90">
        {/* Header */}
         {/* Password Modal */}
         {isPasswordModalOpen && !isAuthorized && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-20">
            <form
              onSubmit={handlePasswordSubmit}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <label className="block text-sm mb-2">Enter Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                required
              />
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                Submit
              </button>
            </form>
          </div>
        )}

        <div className="flex items-center mb-4 sm:mb-6 w-full max-w-4xl px-2">
          <button
            onClick={() => router.push("/")}
            className="mr-2 sm:mr-4 text-gray-700 hover:text-gray-900"
          >
            <MdArrowBack size={24} />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold">Image Manager</h1>
        </div>

        {/* Tabs */}
        <div className="flex mb-4 sm:mb-6 w-full max-w-4xl px-2">
          <button
            onClick={() => setActiveTab("new")}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm sm:text-base ${
              activeTab === "new" ? "bg-blue-500 text-white" : "bg-gray-200"
            } rounded-l focus:outline-none`}
          >
            New Upload
          </button>
          <button
            onClick={() => setActiveTab("edit")}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm sm:text-base ${
              activeTab === "edit" ? "bg-blue-500 text-white" : "bg-gray-200"
            } rounded-r focus:outline-none`}
          >
            Edit Images
          </button>
        </div>

        {/* New Upload Tab */}
        {activeTab === "new" && (
          <div className="w-full flex flex-col items-center px-2">
                <div className="w-full max-w-4xl mb-4 sm:mb-6">
              <label
                htmlFor="upload-title"
                className="block text-sm sm:text-base font-medium text-gray-700"
              >
                Title
              </label>
              <input
                id="upload-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for the images"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Upload Card */}
            <div className="w-full max-w-4xl border-2 border-dashed border-gray-400 rounded-lg p-3 sm:p-4 mb-4 bg-gray-100 sm:mb-6 flex flex-col items-center">
              <p className="text-gray-500 text-center text-sm sm:text-base mb-3 sm:mb-4">
                Drag and drop images here or click Choose Images to upload.
              </p>
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex items-center px-3 sm:px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm sm:text-base"
              >
                <MdUpload className="mr-2" />
                Choose Images
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {isUploading && (
                <div className="w-full mt-3 sm:mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
                    <div
                      className="bg-blue-500 h-3 sm:h-4 rounded-full transition-all duration-500"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-center mt-2 text-gray-600 text-sm sm:text-base">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4 mt-3 sm:mt-4 w-full">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative flex flex-col items-center"
                    >
                      <div className="relative w-full pb-[100%]">
                        <Image
                          fill
                          src={image.preview}
                          alt={`Uploaded ${index}`}
                          className="object-cover rounded shadow absolute inset-0"
                        />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 text-red-500 hover:text-red-700 bg-white rounded-full p-1"
                        >
                          <MdClose size={16} />
                        </button>
                      </div>
                      <p className="mt-1 sm:mt-2 text-xs sm:text-sm font-medium text-gray-700">
                        Image {index + 1}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {images.length > 0 && (
              <button
                onClick={handleUploadToServer}
                disabled={isUploading}
                className={`px-3 sm:px-4 py-2 text-sm sm:text-base ${
                  isUploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white rounded flex items-center`}
              >
                <MdUpload className="mr-2" />
                {isUploading ? "Uploading..." : "Upload Images"}
              </button>
            )}
          </div>
        )}

                {/* Edit Images Tab */}
                {activeTab === "edit" && (
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
        {/* Header with summary */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-6 space-y-2">
          <h2 className="text-xl font-semibold text-gray-800">Image Gallery</h2>
          <p className="text-gray-600">
            {galleryImages.length} Collection{galleryImages.length !== 1 ? 's' : ''} • 
            {galleryImages.reduce((acc, gallery) => acc + gallery.images.length, 0)} Total Image{galleryImages.reduce((acc, gallery) => acc + gallery.images.length, 0) !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((gallery, index) => (
            <div
              key={index}
              className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 overflow-hidden hover:border-gray-400 transition-colors duration-300"
            >
              {/* Collection Header */}
              <div className="p-2 border-b border-dashed border-gray-300">
                <h3 className="font-medium text-gray-800">{gallery.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {gallery.images.length} image{gallery.images.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Images Grid */}
              <div className="p-4">
                <div className="grid grid-cols-4 gap-2">
                  {gallery.images.slice(0, 4).map((image, imgIndex) => (
                    <div
                      key={imgIndex}
                      className={`relative ${
                        imgIndex === 3 && gallery.images.length > 4
                          ? 'after:content-["+' + (gallery.images.length - 4) + '"] after:absolute after:inset-0 after:bg-black/50 after:flex after:items-center after:justify-center after:text-white after:font-medium after:text-lg'
                          : ''
                      }`}
                    >
                      <div className="relative pb-[100%] border border-dashed border-gray-300 rounded-lg overflow-hidden">
                        <Image
                          fill
                          src={image}
                          alt={`${gallery.title} - Image ${imgIndex + 1}`}
                          className="object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-dashed border-gray-300 flex justify-end space-x-2">
                <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  Edit
                </button>
                <button className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 bg-white border border-gray-300 rounded-md hover:bg-red-50 transition-colors">
                  Delete
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
)}

      </div>
    </div>
  );
};

export default UploadPage;
