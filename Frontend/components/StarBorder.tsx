// components/StarBorder.tsx
"use client";

import React from "react";

const StarBorder = ({
  as: Component = "button",
  className = "",
  color = "#7dd3fc",
  speed = "6s",
  thickness = 1,
  children,
  ...rest
}: any) => {
  return (
    <Component
      className={`relative inline-block overflow-hidden rounded-[50px] ${className}`}
      style={{ padding: `${thickness}px 0`, ...rest.style }}
      {...rest}
    >
      <div
        className="absolute w-[300%] h-[50%] opacity-70 bottom-[-11px] right-[-250%] rounded-full animate-star-bottom z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className="absolute w-[300%] h-[50%] opacity-70 top-[-10px] left-[-250%] rounded-full animate-star-top z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div className="relative z-1 bg-gradient-to-b from-black/40 to-gray-900/10 border border-gray-800/20 text-white text-center text-[16px] py-[14px] px-[24px] rounded-[20px]">
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;
