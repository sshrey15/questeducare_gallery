"use client"
import React, { useState } from "react";
import Image from "next/image";
import { MdUpload, MdClose } from "react-icons/md";

interface UploadImage {
  preview: string;
  file: File;
}

interface UploadComponentProps {
  onUploadComplete?: (title: string, images: string[]) => void;
}

const UploadComponent: React.FC<UploadComponentProps> = ({ onUploadComplete }) => {
  const [images, setImages] = useState<UploadImage[]>([]);
  const [title, setTitle] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [isUploading, setIsUploading] = useState(false);

  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prevProgress + Math.random() * 30;
      });
    }, 500);

    return interval;
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
    setUploadStatus("uploading");
    const progressInterval = simulateProgress();

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

      const endpoint = "https://questeducare-gallery.vercel.app/api/imagemanager";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      clearInterval(progressInterval);

      if (response.ok && data.message === "success") {
        setUploadProgress(100);
        setUploadStatus("success");
        
        // Call onUploadComplete callback if provided
        if (onUploadComplete) {
          onUploadComplete(title, base64Images);
        }

        setTimeout(() => {
          setImages([]);
          setTitle("");
          setUploadProgress(0);
          setUploadStatus("idle");
        }, 2000);
      } else {
        setUploadStatus("error");
        alert("Upload failed: " + data.error);
      }
    } catch (error) {
      clearInterval(progressInterval);
      setUploadStatus("error");
      console.error("Error uploading to server:", error);
      alert("Error uploading images.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
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

        {uploadStatus !== "idle" && (
          <div className="w-full mt-3 sm:mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
              <div
                className={`h-3 sm:h-4 rounded-full transition-all duration-500 ${
                  uploadStatus === "success" ? "bg-green-500" : "bg-blue-500"
                }`}
                style={{ width: `${Math.min(uploadProgress, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-center mt-2">
              {uploadStatus === "uploading" && (
                <p className="text-blue-600 text-sm sm:text-base">
                  Uploading... {Math.round(uploadProgress)}%
                </p>
              )}
              {uploadStatus === "success" && (
                <div className="flex items-center text-green-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm sm:text-base">Upload successful!</p>
                </div>
              )}
              {uploadStatus === "error" && (
                <p className="text-red-600 text-sm sm:text-base">
                  Upload failed. Please try again.
                </p>
              )}
            </div>
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
  );
};

export default UploadComponent;