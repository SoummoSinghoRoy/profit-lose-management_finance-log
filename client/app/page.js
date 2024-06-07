"use client"
import Image from "next/image";
import styles from "./page.module.css";
import ProtectedRoute from "./components/route-protection/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="row">
        <div className="col-12">
          <h4>Main page</h4>
        </div>
      </div>
    </ProtectedRoute>
  );
}
