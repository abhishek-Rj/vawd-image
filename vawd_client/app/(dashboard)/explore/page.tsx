import SearchBar from "@/app/components/explore/SearchBar";
import UploadModal from "@/app/components/dashboard/UploadModal";
import MyMediaModal from "@/app/components/dashboard/MyMediaModal";
import ProfileModal from "@/app/components/dashboard/ProfileModal";
import MasonryGrid from "@/app/components/explore/MasonryGrid";
import { cookies } from "next/headers";
import Image from "next/image";

interface ImageType {
  id: string;
  url: string;
  userId: string;
  name: string;
  progress: string;
}

function shuffleArray(array: any[]) {
  let currentIndex = array.length;
  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
}

async function getImages(): Promise<ImageType[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) return [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/posts/all`,
      {
        method: "GET",
        headers: {
          Cookie: `accessToken=${accessToken}`,
        },
        cache: "no-store",
      },
    );
    if (!res.ok) return [];
    const data = await res.json();
    let imgArray = data.images || [];
    // Randomize the default feed
    shuffleArray(imgArray);
    return imgArray;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function searchImages(prompt: string): Promise<ImageType[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) return [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/posts/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `accessToken=${accessToken}`,
        },
        body: JSON.stringify({ prompt }),
        cache: "no-store",
      },
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.result) return [];
    
    return data.result.map((item: any) => ({
      id: item.id,
      url: item.metadata.image_url,
      userId: item.metadata.user_id,
      name: item.metadata.filename,
      progress: "100",
    })) || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function ExplorePage(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const isUploadOpen = searchParams?.upload === "true";
  const isMediaOpen = searchParams?.media === "true";
  const isProfileOpen = searchParams?.profile === "true";
  const q = searchParams?.q || "";
  const images = q ? await searchImages(q) : await getImages();
  // Generate deterministic-ish sizes for masonry (to avoid hydration mismatch if this were dynamic, but we can just hardcode an array of heights for simplicity)
  const heights = [
    250, 420, 310, 380, 200, 300, 410, 260, 390, 290, 450, 320, 240, 370, 280,
    430, 210, 340, 270, 400, 330, 460, 220, 360,
  ];

  return (
    <div className="w-full min-h-full relative pb-40">
      <UploadModal isOpen={isUploadOpen} />
      <MyMediaModal isOpen={isMediaOpen} />
      <ProfileModal isOpen={isProfileOpen} />

      {/* Header section (optional, to maintain brutalist aesthetic padding) */}
      <div className="h-14 px-4 sm:pl-8 sm:pr-24 grid-border-b bg-bg/50 backdrop-blur sticky top-0 z-30 pointer-events-none flex items-center justify-center sm:justify-start">
        <a href="/explore" className="pointer-events-auto transition-opacity hover:opacity-70">
          <h1 className="text-lg sm:text-lg font-bold tracking-tight text-fg uppercase translate-y-px">
            EXPLORE<span className="text-accent">_MEDIA</span>
          </h1>
        </a>
      </div>

      {/* Masonry Grid */}
      <div className="p-4 sm:p-8">
        <MasonryGrid images={images as any} heights={heights} />
      </div>

      <SearchBar initialQuery={q} />
    </div>
  );
}
