import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import TenstackProviders from "@/hooks/tenstackProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DahinBankDashBoard",
  description: "DahinBankDashBoard dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" type="image/svg+xml" href="/LeaderLogoLight.jpg" />
        </head>
        <body className={`${inter.className} bg-[#f1f5f9] dark:bg-[#1a222c] `}>
          <TenstackProviders>
            <ToastContainer />
            <main>{children}</main>
          </TenstackProviders>
        </body>
      </html>
    </SessionProvider>
  )

}
