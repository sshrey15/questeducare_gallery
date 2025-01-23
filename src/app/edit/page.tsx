"use client"
import React, { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useRouter } from "next/navigation";

import UploadComponent from "../components/UploadTab";
import EditComponent from "../components/EditTab";

const ImageManagerPage = () => {
  const [activeTab, setActiveTab] = useState<"new" | "edit">("new");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(true);
  const router = useRouter();

  const correctPassword = "questeducareadmin";

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthorized(true);
      setIsPasswordModalOpen(false);
    } else {
      alert("Incorrect password!");
    }
  };

  const handleUploadComplete = () => {
    // Optional: Add any additional logic after successful upload
    // For example, switch to edit tab or refresh gallery
    setActiveTab("edit");
  };

  return (
    <div className="relative w-full min-h-screen pt-16">
      {/* Background with opacity */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="w-full h-full bg-[url('/sci.avif')] bg-fixed bg-center bg-cover opacity-20" />
      </div>

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

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center p-2 sm:p-4 min-h-screen bg-white bg-opacity-90">
        {/* Header */}
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

        {/* Conditional Rendering of Components */}
        {isAuthorized && (
          <>
            {activeTab === "new" && (
              <UploadComponent onUploadComplete={handleUploadComplete} />
            )}
            {activeTab === "edit" && <EditComponent />}
          </>
        )}
      </div>
    </div>
  );
};

export default ImageManagerPage;