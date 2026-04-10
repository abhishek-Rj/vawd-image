import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { SessionProvider } from "@/context/session";
import { getServerSession } from "@/lib/auth";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const monoSpec = localFont({
  src: "../public/fonts/MonoSpec-Variable.ttf",
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "vawd_image — ai-powered visual search",
  description:
    "search images by visual content using clip embeddings and pinecone vector search. powered by a rag pipeline for intelligent image retrieval.",
  icons: {
    icon: "/vawd.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html
      lang="en"
      className={cn("h-full", monoSpec.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
