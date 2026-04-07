"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiX, FiCamera, FiRefreshCw } from "react-icons/fi";
import { useSession } from "@/context/session";

interface UserProfile {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePic: string;
}

interface ProfileModalProps {
  isOpen: boolean;
}

export default function ProfileModal({ isOpen }: ProfileModalProps) {
  const router = useRouter();
  const { setUser, user: cachedUser } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<UserProfile>({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    profilePic: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) fetchProfile();
  }, [isOpen]);

  if (!isOpen) return null;

  const fetchProfile = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/auth/user`,
        { method: "GET", credentials: "include" }
      );
      if (!res.ok) throw new Error("FAILED_TO_LOAD_PROFILE");
      const data = await res.json();
      setProfile(data.user);
    } catch (err) {
      setError("FAILED_TO_LOAD_PROFILE");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    router.replace("/explore");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("IMAGE_TOO_LARGE_(MAX_5MB)");
      return;
    }

    setIsUploadingImage(true);
    setError("");
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/auth/profilePic`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("UPLOAD_FAILED");
      const data = await res.json();
      
      // Update local profile state
      setProfile((prev) => ({ ...prev, profilePic: data.profilePic }));
      
      // Update global session cache gracefully
      if (cachedUser) {
        setUser({ ...cachedUser, profilePic: data.profilePic });
      }
      router.refresh();
    } catch (err) {
      setError("PROFILE_PIC_UPLOAD_FAILED");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/auth/update`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            user_name: profile.username,
            first_name: profile.firstName,
            last_name: profile.lastName,
          }),
        }
      );
      if (!res.ok) throw new Error("UPDATE_FAILED");

      // Sync Session Context
      if (cachedUser) {
        setUser({ ...cachedUser, username: profile.username });
      }
      router.refresh();
      handleClose();
    } catch (err) {
      setError("PROFILE_UPDATE_FAILED");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-bg grid-border shadow-2xl flex flex-col relative overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="px-6 py-4 grid-border-b bg-surface flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-widest text-fg uppercase flex items-center gap-2">
            USER<span className="text-accent">_PROFILE</span>
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
        <div className="p-6 flex flex-col space-y-6">
          {error && (
            <div className="text-[10px] font-bold uppercase text-red-500 bg-red-500/10 grid-border border-red-500 p-2 text-center tracking-widest">
              [ERROR]: {error}
            </div>
          )}

          {/* Profile Picture Section */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden grid-border bg-surface">
                <Image
                  src={
                    profile.profilePic ||
                    `https://api.dicebear.com/7.x/notionists/svg?seed=${
                      profile.username || "user"
                    }&backgroundColor=ff4d00`
                  }
                  alt="Profile"
                  fill
                  className={`object-cover ${isUploadingImage ? 'opacity-50 grayscale' : 'grayscale brightness-150 contrast-125'}`}
                />
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="absolute inset-0 bg-bg/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-dashed border-fg disabled:cursor-wait"
              >
                {isUploadingImage ? (
                  <FiRefreshCw className="text-fg animate-spin" size={24} />
                ) : (
                  <FiCamera className="text-fg" size={24} />
                )}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-mono tracking-widest text-fg-dim block mb-1">
                EMAIL [READ_ONLY]
              </label>
              <input
                type="text"
                value={profile.email}
                disabled
                className="w-full bg-surface grid-border px-3 py-2 text-xs font-mono text-fg-muted opacity-70 cursor-not-allowed uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-mono tracking-widest text-fg-dim block mb-1">
                  FIRST_NAME
                </label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) =>
                    setProfile({ ...profile, firstName: e.target.value })
                  }
                  className="w-full bg-transparent grid-border px-3 py-2 text-xs font-mono text-fg focus:border-accent outline-none transition-colors uppercase"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-mono tracking-widest text-fg-dim block mb-1">
                  LAST_NAME
                </label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) =>
                    setProfile({ ...profile, lastName: e.target.value })
                  }
                  className="w-full bg-transparent grid-border px-3 py-2 text-xs font-mono text-fg focus:border-accent outline-none transition-colors uppercase"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono tracking-widest text-fg-dim block mb-1">
                USERNAME
              </label>
              <input
                type="text"
                value={profile.username}
                onChange={(e) =>
                  setProfile({ ...profile, username: e.target.value.toLowerCase() })
                }
                className="w-full bg-transparent grid-border px-3 py-2 text-xs font-mono text-fg focus:border-accent outline-none transition-colors lowercase"
              />
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="grid-border-t grid grid-cols-2 mt-auto">
          <button
            onClick={handleClose}
            className="grid-border-r py-3 sm:py-4 text-xs font-bold uppercase tracking-widest text-fg-muted hover:bg-surface hover:text-fg transition-colors disabled:opacity-50"
            disabled={isSaving || isUploadingImage}
          >
            CANCEL
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || isUploadingImage || isLoading}
            className="py-3 sm:py-4 text-xs font-bold uppercase tracking-widest text-bg bg-accent transition-colors disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-fg"
          >
            {isSaving ? "UPDATING..." : "SAVE_CHANGES"}
          </button>
        </div>
      </div>
    </div>
  );
}
