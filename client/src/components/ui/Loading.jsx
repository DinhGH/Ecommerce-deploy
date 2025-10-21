import React, { useState } from "react";

// Component 1: Dots Wave Loading
const DotsWaveLoader = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div
        className="w-3 h-3 bg-black rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}
      ></div>
      <div
        className="w-3 h-3 bg-black rounded-full animate-bounce"
        style={{ animationDelay: "150ms" }}
      ></div>
      <div
        className="w-3 h-3 bg-black rounded-full animate-bounce"
        style={{ animationDelay: "300ms" }}
      ></div>
      <div
        className="w-3 h-3 bg-black rounded-full animate-bounce"
        style={{ animationDelay: "450ms" }}
      ></div>
    </div>
  );
};

// Component 2: Spinning Circles
const SpinningCircles = () => {
  return (
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

// Component 3: Pulsing Square
const PulsingSquare = () => {
  return (
    <div className="relative">
      <div className="w-12 h-12 bg-black animate-pulse"></div>
      <div className="absolute inset-0 w-12 h-12 border-2 border-black animate-ping"></div>
    </div>
  );
};

// Component 4: Loading Bars
const LoadingBars = () => {
  return (
    <div className="flex items-end space-x-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="w-2 bg-black animate-pulse"
          style={{
            height: `${Math.random() * 20 + 10}px`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: "1s",
          }}
        ></div>
      ))}
    </div>
  );
};

// Component 5: Morphing Shape
const MorphingShape = () => {
  return (
    <div className="w-16 h-16">
      <div
        className="w-full h-full bg-black transition-all duration-1000 ease-in-out"
        style={{
          animation: "morph 2s infinite ease-in-out",
          borderRadius: "0% 100% 0% 100% / 100% 0% 100% 0%",
        }}
      ></div>
      <style jsx>{`
        @keyframes morph {
          0%,
          100% {
            border-radius: 0% 100% 0% 100% / 100% 0% 100% 0%;
          }
          25% {
            border-radius: 100% 0% 100% 0% / 0% 100% 0% 100%;
          }
          50% {
            border-radius: 100% 100% 0% 0% / 0% 0% 100% 100%;
          }
          75% {
            border-radius: 0% 0% 100% 100% / 100% 100% 0% 0%;
          }
        }
      `}</style>
    </div>
  );
};

// Component 6: Elegant Spinner
const ElegantSpinner = ({ message = "" }) => {
  return (
    <div className="fixed inset-0 flex items-center flex-col justify-center z-50 bg-black/60">
      <div className="relative w-20 h-20">
        <div className="absolute inset-2 border border-gray-300 rounded-full"></div>
        <div className="absolute inset-0 border-2 border-transparent border-t-black rounded-full animate-spin"></div>
        <div
          className="absolute inset-1 border border-transparent border-t-gray-400 rounded-full animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        ></div>
      </div>
      <p className="text-lg font-semibold text-gray-100">{message}</p>
    </div>
  );
};

// Component 7: Text Loading with Typewriter Effect
const TextLoader = () => {
  const [dots, setDots] = useState("");

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <div className="text-2xl font-mono text-black">Loading{dots}</div>;
};

// Component 8: Skeleton Loader
const SkeletonLoader = () => {
  return (
    <div className="w-64 p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-3 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2 animate-pulse"></div>
      </div>
    </div>
  );
};

export {
  PulsingSquare,
  DotsWaveLoader,
  TextLoader,
  SkeletonLoader,
  LoadingBars,
  SpinningCircles,
  MorphingShape,
  ElegantSpinner,
};
