// components/RotatingText.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function RotatingText({ texts = [], interval = 2000, className = "" }: any) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % texts.length), interval);
    return () => clearInterval(t);
  }, [texts.length, interval]);

  return (
    <span className={`inline-flex items-center ${className}`} aria-live="polite">
      <motion.span
        key={idx}
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        exit={{ y: "-120%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {texts[idx]}
      </motion.span>
    </span>
  );
}
