import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Font configurations
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Improves performance for font loading
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Extended metadata for better SEO
export const metadata: Metadata = {
  title: "Daffodil Cover Page Generator | DIU Assignment Templates",
  description: "Create professional cover pages for Daffodil International University assignments and lab reports with customizable themes and live preview features.",
  keywords: "Daffodil International University, DIU, cover page generator, assignment template, lab report, student tools, university reports",
  authors: [{ name: "Daffodil International University" }],
  category: "Education",
  openGraph: {
    title: "Daffodil Cover Page Generator | DIU Assignment Templates",
    description: "Create professional cover pages for Daffodil International University assignments and lab reports with customizable themes and live preview.",
    type: "website",
    locale: "en_US",
    siteName: "DIU Cover Page Generator",
    images: [
      {
        url: "/og-image.png", // Add an OG image for better social media sharing
        width: 1200,
        height: 630,
        alt: "Daffodil Cover Page Generator Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DIU Cover Page Generator - Create Professional Assignment Templates",
    description: "Generate customized cover pages for Daffodil International University assignments with live preview.",
    images: ["/twitter-image.png"], // Add a Twitter card image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://diu-cover-page.yourdomain.com", // Replace with your actual domain
  },
  verification: {
    google: "your-google-verification-code", // Add your verification code when available
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to origins for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon tags */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Theme color for browser UI */}
        <meta name="theme-color" content="#ffde59" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}