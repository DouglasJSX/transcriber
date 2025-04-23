import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div className="w-full h-screen flex flex-row justify-center items-center gap-2">
      Page not found, return to{" "}
      <Link
        href="/"
        className="px-5 border-2 border-white bg-white text-black hover:bg-transparent hover:text-white py-[4px] my-2 duration-300 rounded-lg"
      >
        Home
      </Link>
    </div>
  );
}
