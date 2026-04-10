import SearchBar from "@/app/components/explore/SearchBar";
import UploadModal from "@/app/components/dashboard/UploadModal";
import MyMediaModal from "@/app/components/dashboard/MyMediaModal";
import ProfileModal from "@/app/components/dashboard/ProfileModal";
import { cookies } from "next/headers";
import Image from "next/image";

interface ImageType {
  id: string;
  url: string;
  userId: string;
  name: string;
  progress: string;
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
    console.log(data.images);
    return data.images || [];
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

    return (
      data.result.map((item: any) => ({
        id: item.id,
        url: item.metadata.image_url,
        userId: item.metadata.user_id,
        name: item.metadata.filename,
      })) || []
    );
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
      <div className="px-8 py-10 grid-border-b bg-bg/50 backdrop-blur sticky top-0 z-30 pointer-events-none">
        <h1 className="text-2xl font-bold tracking-tight text-fg uppercase">
          EXPLORE<span className="text-accent">_MEDIA</span>
        </h1>
        <p className="mt-2 text-xs text-fg-dim font-supply uppercase tracking-[0.15em]">
          DISCOVER VISUAL CONTENT ACROSS THE NETWORK
        </p>
      </div>

      {/* Masonry Grid */}
      <div className="p-8">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.length > 0
            ? images.map((img: ImageType, i: number) => (
                <div
                  key={img.id || i}
                  className="break-inside-avoid bg-surface grid-border group relative overflow-hidden transition-all hover:border-fg w-full"
                >
                  <div className="relative w-full">
                    <Image
                      src={img.url}
                      alt="Uploaded media"
                      width={500}
                      height={500}
                      className="w-full h-auto object-cover brightness-110 contrast-125 hover:brightness-100 hover:contrast-100 transition-all duration-300"
                    />
                  </div>
                  {/* Minimal box decorations */}
                  <div className="absolute top-4 left-4 flex gap-1.5">
                    <div className="w-2 h-2 bg-accent opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
                  </div>
                  {/* Pseudo image ID */}
                  <div className="absolute bottom-4 right-4 text-[10px] font-supply text-border-light uppercase group-hover:text-fg-muted transition-colors duration-300 tracking-widest bg-bg/80 px-2 py-1">
                    [{img.name}]
                  </div>
                  <div className="absolute inset-0 bg-fg opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300 pointer-events-none" />
                </div>
              ))
            : heights.map((height, i) => (
                <div
                  key={i}
                  className="break-inside-avoid bg-surface grid-border group relative overflow-hidden transition-all hover:border-fg w-full opacity-50"
                  style={{ height: `${height}px` }}
                >
                  <div className="absolute top-4 left-4 flex gap-1.5">
                    <div className="w-2 h-2 bg-accent opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
                  </div>
                  <div className="absolute bottom-4 right-4 text-[10px] font-supply text-border-light uppercase group-hover:text-fg-muted transition-colors duration-300 tracking-widest">
                    [EMPTY_{String(i).padStart(4, "0")}]
                  </div>
                </div>
              ))}
        </div>
      </div>

      <SearchBar initialQuery={q} />
    </div>
  );
}
