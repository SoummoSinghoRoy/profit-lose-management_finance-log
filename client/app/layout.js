"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import StoreProvider from "./StoreProvider";
import Navbar from "./components/navbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <Navbar/>
          <div className="container-fluid container-lg container-md">
            {children}
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
