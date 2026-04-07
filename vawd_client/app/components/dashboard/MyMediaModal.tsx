"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiX, FiTrash2, FiRefreshCw, FiCheck } from "react-icons/fi";

interface ImageType {
  id: string; // The backend uses UUID
  url: string;
  name: string;
  progress: string;
  userId: string;
}

interface MyMediaModalProps {
  isOpen: boolean;
}

export default function MyMediaModal({ isOpen }: MyMediaModalProps) {
  const router = useRouter();
  const [images, setImages] = useState<ImageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchImages = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/auth/images`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("FAILED_TO_LOAD_MEDIA");
      const data = await res.json();
      setImages(data.images || []);
    } catch (err) {
      setError("FAILED_TO_LOAD_MEDIA");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setImages([]);
    setError("");
    router.replace("/explore");
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/posts/delete`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id }),
        }
      );
      if (!res.ok) throw new Error("DELETION_FAILED");
      setImages((prev) => prev.filter((img) => img.id !== id));
      setConfirmDeleteId(null);
      router.refresh(); // Update the background masonry grid as well
    } catch (err) {
      console.error(err);
      alert("DELETION_FAILED");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[85vh] bg-bg grid-border shadow-2xl flex flex-col relative overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="px-6 py-4 grid-border-b bg-surface flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-sm font-bold tracking-widest text-fg uppercase flex items-center gap-2">
            MY<span className="text-accent">_MEDIA</span>
            {isLoading && <FiRefreshCw className="animate-spin text-fg-dim" />}
          </h2>
          <button
            onClick={handleClose}
            className="text-fg-dim hover:text-fg transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="text-center p-4 grid-border border-red-500/50 bg-red-500/10 text-red-500 text-xs font-mono uppercase tracking-widest mb-6">
              [ERROR]: {error}
            </div>
          )}

          {!isLoading && images.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center py-20 text-fg-dim">
              <span className="text-xs font-mono uppercase tracking-widest">
                [NO_MEDIA_FOUND]
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => {
              const isConfirming = confirmDeleteId === img.id;

              return (
                <div
                  key={img.id}
                  className="group relative grid-border bg-surface overflow-hidden aspect-square"
                >
                  <Image
                    src={img.url}
                    alt={img.name || "User media"}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  
                  {/* Overlay */}
                  <div className={`absolute inset-0 bg-bg/80 transition-opacity flex flex-col items-center justify-center p-4 ${isConfirming ? 'opacity-100 z-10' : 'opacity-0 group-hover:opacity-100'}`}>
                    <span className="text-[10px] font-mono text-fg uppercase tracking-widest break-all text-center mb-4 line-clamp-2">
                      {isConfirming ? "ARE YOU SURE?" : (img.name || "[UNNAMED]")}
                    </span>
                    
                    {isConfirming ? (
                      <div className="flex gap-4">
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="w-10 h-10 flex items-center justify-center bg-surface hover:bg-fg hover:text-bg transition-colors grid-border text-fg"
                        >
                          <FiX size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(img.id)}
                          className="w-10 h-10 flex items-center justify-center bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-colors grid-border border-red-500"
                        >
                          <FiCheck size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(img.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-colors grid-border border-red-500 text-xs font-bold tracking-widest uppercase"
                      >
                        <FiTrash2 size={14} />
                        DELETE
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
