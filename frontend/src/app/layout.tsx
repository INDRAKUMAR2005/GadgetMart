import React from "react";
import "./globals.css";

export const metadata = {
  title: "GadgetMart | Premium Tech Hub",
  description: "Comparing 120+ Live Gadgets from Amazon, Flipkart, & more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
