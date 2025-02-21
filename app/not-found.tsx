"use client";
import Link from "next/link";
export default function NotFound() {
  return (
    <div>
      <div className="h-screen flex flex-col justify-center items-center">
        <h1 className="text-8xl font-bold  ">404</h1>
        <p className="text-4xl font-medium  ">Page Not Found</p>
        <Link href="/" className="mt-4 text-xl text-blue-600 hover:underline">
          Go back home
        </Link>
      </div>
    </div>
  );
}
