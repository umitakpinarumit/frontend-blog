import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/lib/redux/Provider";
import Header from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Blog Platform",
  description: "Full-stack blog platform with Next.js and Redux",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        {/* Dark mode flash önleme scripti - sayfa yüklenmeden önce çalışır */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (!theme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ReduxProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <main>{children}</main>
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}

