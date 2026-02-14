import type { Metadata } from "next";
import "./globals.css";
import { Tajawal } from "next/font/google";   // ← add this

export const metadata: Metadata = {
  title: "معرض أعمالي | مطور تطبيقات متكامل",
  description: "معرض أعمالي - مطور واجهات برمجية متكامل خبير في بناء المنتجات الرقمية",
};

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'], // Tajawal supports both Arabic and Latin subsets
  weight: ['200', '300', '400', '500', '700', '800', '900'], // Specify the weights you need
  variable: '--font-tajawal', // Optional: Define a CSS variable for use in CSS/Tailwind
  display: 'swap', // Ensures text is visible while the font loads
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.className}`}   >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        /> */}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background-light text-slate-900 font-display selection:bg-primary/20">
        {children}
      </body>
    </html>
  );
}
