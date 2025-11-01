"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { motion } from "framer-motion"

interface FileUploaderProps {
  onFileSelect: (file: File) => void
  accept?: string
  label?: string
}

export default function FileUploader({
  onFileSelect,
  accept = ".pdf,.doc,.docx",
  label = "Upload File",
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
      onFileSelect(droppedFile)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      onFileSelect(selectedFile)
    }
  }

  return (
    <div className="w-full">
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{ scale: isDragging ? 1.02 : 1 }}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        }`}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="mx-auto mb-3 text-muted-foreground" size={32} />
        <p className="font-semibold mb-1">{label}</p>
        <p className="text-sm text-muted-foreground">or drag and drop</p>
        <input ref={inputRef} type="file" accept={accept} onChange={handleFileChange} className="hidden" />
      </motion.div>

      {file && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-muted rounded-lg flex items-center justify-between"
        >
          <span className="text-sm font-medium truncate">{file.name}</span>
          <button onClick={() => setFile(null)} className="p-1 hover:bg-background rounded transition">
            <X size={18} />
          </button>
        </motion.div>
      )}
    </div>
  )
}


// "use client";
// import React from "react";

// interface FileUploaderProps {
//   label: string;
//   onFileSelect: (file: File | File[]) => void;
//   multiple?: boolean; // ✅ add multiple prop
// }

// const FileUploader: React.FC<FileUploaderProps> = ({ label, onFileSelect, multiple = false }) => {
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;
//     if (multiple) {
//       onFileSelect(Array.from(e.target.files));
//     } else {
//       onFileSelect(e.target.files[0]);
//     }
//   };

//   return (
//     <div>
//       <label className="block text-sm font-medium mb-1">{label}</label>
//       <input
//         type="file"
//         onChange={handleChange}
//         multiple={multiple}
//         accept=".pdf"
//         className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-lg file:text-sm file:font-semibold file:bg-background hover:file:bg-gray-100"
//       />
//     </div>
//   );
// };

// export default FileUploader;


