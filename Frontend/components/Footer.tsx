// components/Footer.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Linkedin, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Image src="/logo.png" alt="Cerevo" width={100} height={32} />
          <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} Cerevo AI Career Platform</div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms</Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link>

          <div className="flex items-center gap-2 ml-4">
            <a href="#" aria-label="Cerevo LinkedIn" className="p-2 rounded-md hover:bg-muted"><Linkedin size={18} /></a>
            <a href="#" aria-label="Cerevo GitHub" className="p-2 rounded-md hover:bg-muted"><Github size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
