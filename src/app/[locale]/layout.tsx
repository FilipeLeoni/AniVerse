import Header from "@/components/partials/Header";
import "../globals.css";
import NextTopLoader from "nextjs-toploader";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { NextIntlClientProvider, useLocale, useMessages } from "next-intl";
import Providers from "../providers";
import Footer from "@/components/partials/Footer";
import { Toaster } from "react-hot-toast";
import { WatchHistoryProvider } from "@/contexts/WatchHistoryContext";
import { VideoProvider } from "@/contexts/GlobalPlayerContext";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import BaseLayout from "@/components/layout/BaseLayout";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Aniverse",
  description: "An anime/manga website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const messages = useMessages();

  const test = false;

  return (
    <html lang={locale}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Providers>
          <VideoProvider>
            <WatchHistoryProvider>
              <body className={outfit.className}>
                <NextTopLoader color="#EF4444" />
                {/* {test && <Header />} */}
                <BaseLayout>{children}</BaseLayout>
                {/* <Footer /> */}
                <Toaster />
              </body>
            </WatchHistoryProvider>
          </VideoProvider>
        </Providers>
      </NextIntlClientProvider>
    </html>
  );
}
