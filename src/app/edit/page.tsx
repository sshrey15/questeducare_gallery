"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { MdUpload, MdArrowBack, MdClose } from 'react-icons/md';
import { useRouter } from 'next/navigation';

const UploadPage = () => {
  const [images, setImages] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'new' | 'edit'>('new');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleUploadToServer = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Background with opacity */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div 
          className="w-full h-full bg-[url('/sci.avif')] bg-fixed bg-center bg-cover opacity-20"
        />
      </div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center p-4 min-h-screen bg-white bg-opacity-90">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.push('/')}
            className="mr-4 text-gray-700 hover:text-gray-900"
          >
            <MdArrowBack size={24} />
          </button>
          <h1 className="text-2xl font-bold">Image Manager</h1>
        </div>

        {/* Tabs */}
        <div className="flex mb-6">
          <button
            onClick={() => setActiveTab('new')}
            className={`px-4 py-2 ${
              activeTab === 'new' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            } rounded-l focus:outline-none`}
          >
            New Upload
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 ${
              activeTab === 'edit' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            } rounded-r focus:outline-none`}
          >
            Edit Images
          </button>
        </div>

        {activeTab === 'new' && (
          <div className="w-full flex flex-col items-center">
            {/* Card for Upload Area */}
            <div className="w-full max-w-4xl border-2 border-dashed border-gray-400 rounded-lg p-4 mb-6 flex flex-col items-center">
              <p className="text-gray-500 text-center mb-4">Drag and drop images here or click Choose Images to upload.</p>
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
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
                <div className="w-full mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-center mt-2 text-gray-600">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}

              {images.length > 0 && (
                <div className="grid grid-cols-6 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative flex flex-col items-center">
                      <Image
                        width={400}
                        height={400}
                        src={image}
                        alt={`Uploaded ${index}`}
                        className="object-cover rounded shadow"
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-0 right-0 mt-2 mr-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1"
                      >
                        <MdClose size={16} />
                      </button>
                      <p className="mt-2 text-sm font-medium text-gray-700">Image {index + 1}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {images.length > 0 && (
              <button
                onClick={handleUploadToServer}
                disabled={isUploading}
                className={`px-4 py-2 ${
                  isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-300 hover:bg-blue-600'
                } text-white rounded flex items-center`}
              >
                <MdUpload className="mr-2" />
                {isUploading ? 'Uploading...' : 'Upload Images'}
              </button>
            )}
          </div>
        )}

        {activeTab === 'edit' && (
          <div className="w-full flex flex-col items-center">
            <p className="text-gray-500">Edit functionality will be added soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;