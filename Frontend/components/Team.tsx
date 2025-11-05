// components/Team.tsx
"use client";

import React from "react";
import { Linkedin, Github } from "lucide-react";
import Image from "next/image";

export default function Team() {
  return (
    <div className="my-5">
      <h3 className="text-3xl font-bold mb-8">Meet the <span className="text-primary">Founders</span></h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-card/30 border border-border/30 rounded-lg p-6 flex gap-4 items-center">
                            <Image src="/hammad.jpeg" className="rounded-xl" alt="Aitzaz Hassan"  width={100} height={100} />
          <div>
            <div className="font-semibold">Muhammad Hammad</div>
            <div className="text-sm text-muted-foreground">Founder & ML Engineer</div>
            <div className="mt-3 flex gap-3">
              <a href="https://www.linkedin.com/in/hammad-shah-90741b25b" aria-label="Hammad LinkedIn" className="p-2 rounded-md hover:bg-muted"><Linkedin size={18} /></a>
              <a href="https://github.com/hammadshah18" aria-label="Hammad GitHub" className="p-2 rounded-md hover:bg-muted"><Github size={18} /></a>
            </div>
          </div>
        </div>

        <div className="bg-card/30 border border-border/30 rounded-lg p-6 flex gap-4 items-center">
                   <Image src="/aitzaz.jpg" className="rounded-xl" alt="Aitzaz Hassan"  width={100} height={100} />
                 {/* <img 
            src="./aitzaz.jpg" 
            alt="Aitzaz Hassan" 
            className="w-20 h-20 rounded-xl object-cover"
          /> */}
          <div>
            <div className="font-semibold">Aitzaz Hassan</div>
            <div className="text-sm text-muted-foreground">Founder & Developer</div>
            <div className="mt-3 flex gap-3">
              <a href="https://www.linkedin.com/in/aitzazhassan2005/" aria-label="Aitzaz LinkedIn" className="p-2 rounded-md hover:bg-muted"><Linkedin size={18} /></a>
              <a href="https://github.com/Aitzaz-Hakro" aria-label="Aitzaz GitHub" className="p-2 rounded-md hover:bg-muted"><Github size={18} /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
