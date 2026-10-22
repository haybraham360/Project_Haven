import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

// "Project Haven" is a working name (spec §16) — update once branding is final.
export const metadata: Metadata = {
  title: "Project Haven — A safe place to talk and find support",
  description:
    "Free access to volunteer professionals, moderated peer support, and practical self-help. Not an emergency service.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
