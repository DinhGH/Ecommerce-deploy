"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useRef } from "react";
import MainContent from "../components/MainContent";
import Intro from "../components/Intro";

export default function Home() {
  const mainRef = useRef(null);

  return (
    <div
      style={{ fontFamily: "'TASA Orbiter', sans-serif" }}
      className="
        overflow-x-hidden
        min-h-screen w-screen h-screen snap-y snap-mandatory overflow-y-scroll
      "
    >
      {/* <Navbar /> */}
      <section className="h-screen snap-start">
        <Intro
          scrollToMain={() =>
            mainRef.current?.scrollIntoView({ behavior: "smooth" })
          }
        />
      </section>

      {/* Đây là phần main content */}
      <section className=" snap-start">
        <div ref={mainRef} className="bg-[#ffffff] text-black">
          <MainContent />
        </div>
      </section>

      {/* <Footer /> */}
    </div>
  );
}
