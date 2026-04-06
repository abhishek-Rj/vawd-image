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
  title: "Vawd_Image — AI-Powered Visual Search",
  description:
    "Search images by visual content using CLIP embeddings and Pinecone vector search. Powered by a RAG pipeline for intelligent image retrieval.",
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
