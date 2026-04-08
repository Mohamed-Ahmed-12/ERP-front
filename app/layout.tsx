import "./globals.css";

import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/context/auth";

export const metadata = {
  title: "Oretech",
  description: "Enterprise Resource Planning System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* <ThemeModeScript /> */}
      </head>
      <body
        className={""}
      >
        <ToastContainer position="bottom-right" />
        {/* <ThemeInit /> */}
        <AuthProvider>
            {children}
        </AuthProvider>
      </body>
    </html>
  );
}
