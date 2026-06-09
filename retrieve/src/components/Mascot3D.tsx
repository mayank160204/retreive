"use client";

import React from "react";

interface Mascot3DProps {
  emotion?: "idle" | "celebrating" | "thinking" | "happy" | "love" | "scared" | "winner" | "sad" | "sleepy" | "zoomies";
  className?: string;
}

export default function Mascot3D({ emotion = "happy", className = "" }: Mascot3DProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl w-full h-full flex items-center justify-center ${className}`}>
      <img
        src="/assets/mascot_dashboard.jpg"
        alt="Scratten Mascot"
        className="w-full h-full object-cover rounded-xl"
      />
    </div>
  );
}
