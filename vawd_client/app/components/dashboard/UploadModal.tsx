"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiX, FiUploadCloud, FiCheckCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";
import { SquareLoader } from "react-spinners";

interface UploadModalProps {
  isOpen: boolean;
}

export default function UploadModal({ isOpen }: UploadModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    setFile(null);
    setPreviewUrl(null);
    setError("");
    setIsUploading(false);
    setUploadSuccess(false);
    router.replace("/explore");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("FILE_TOO_LARGE (MAX 5MB)");
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("NO_FILE_SELECTED");
      return;
    }
    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/posts/upload`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("UPLOAD_FAILED");
      }

      setIsUploading(false);
      setUploadSuccess(true);
      router.refresh(); // Fetch new images on grid
      
      // Delay to show success animation before closing
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError("UPLOAD_FAILED_TRY_AGAIN");
      console.error(err);
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="w-full max-w-md bg-bg grid-border shadow-2xl flex flex-col relative overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 grid-border-b bg-surface flex items-center justify-between">
              <h2 className="text-sm font-bold tracking-widest text-fg uppercase">
                UPLOAD<span className="text-accent">_MEDIA</span>
              </h2>
              <button
                onClick={handleClose}
                disabled={isUploading || uploadSuccess}
                className="text-fg-dim hover:text-fg transition-colors disabled:opacity-50"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col space-y-4 relative min-h-[250px]">
              <AnimatePresence mode="wait">
                {isUploading ? (
                  <motion.div
                    key="uploading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-bg/90 z-20"
                  >
                    <SquareLoader color="#ff4d00" size={40} />
                    <p className="mt-4 text-xs font-mono font-bold tracking-widest text-accent animate-pulse uppercase">
                      UPLOADING_YOUR_ARTWORK...
                    </p>
                  </motion.div>
                ) : uploadSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-bg z-20"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                      className="text-green-500 mb-4"
                    >
                      <FiCheckCircle size={64} />
                    </motion.div>
                    <p className="text-sm font-mono font-bold tracking-widest text-fg uppercase text-center">
                      UPLOAD_SUCCESSFUL
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full flex flex-col space-y-4"
                  >
                    {(!file || !previewUrl) ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-48 grid-border border-dashed flex flex-col items-center justify-center text-fg-dim hover:text-fg hover:border-fg transition-colors cursor-pointer bg-surface/50 hover:bg-surface"
                      >
                        <FiUploadCloud size={32} className="mb-2 text-accent" />
                        <span className="text-xs font-mono uppercase tracking-widest">
                          CLICK_TO_BROWSE
                        </span>
                      </div>
                    ) : (
                      <div className="w-full flex justify-center bg-surface grid-border relative p-1 group">
                        <button
                          onClick={() => {
                            setFile(null);
                            setPreviewUrl(null);
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-bg/90 text-fg hover:bg-red-500 hover:text-white transition-colors z-10 grid-border"
                        >
                          <FiX size={14} />
                        </button>
                        <div className="relative w-full h-48">
                          <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    )}

                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleFileChange}
                    />

                    {file && (
                      <div className="text-[10px] font-supply uppercase tracking-widest text-fg-dim truncate">
                        [FILE]: {file.name}
                      </div>
                    )}

                    {error && (
                      <div className="text-[10px] uppercase font-bold text-red-500 tracking-widest text-center mt-2">
                        🚨 {error}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer actions */}
            <div className="grid-border-t grid grid-cols-2 mt-auto">
              <button
                onClick={handleClose}
                className="grid-border-r py-3 sm:py-4 text-xs font-bold uppercase tracking-widest text-fg-muted hover:bg-surface hover:text-fg transition-colors disabled:opacity-30 disabled:pointer-events-none"
                disabled={isUploading || uploadSuccess}
              >
                CANCEL
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || isUploading || uploadSuccess}
                className="relative py-3 sm:py-4 text-xs font-bold uppercase tracking-widest text-bg bg-accent transition-colors disabled:opacity-30 disabled:pointer-events-none hover:bg-fg"
              >
                <span className={`${(isUploading || uploadSuccess) ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
                  UPLOAD_IMAGE
                </span>
                {(isUploading || uploadSuccess) && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    WORKING...
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

