'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { FileText, Trash2, UploadCloud } from 'lucide-react';
import { useRef, useState } from 'react';

interface FileUploadCardProps {
  file: File | null;
  isUploading: boolean;
  onFileSelected: (file: File) => void;
  onRemoveFile: () => void;
  onStartInterview: () => void;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }

  return `${(kb / 1024).toFixed(2)} MB`;
}

export function FileUploadCard({
  file,
  isUploading,
  onFileSelected,
  onRemoveFile,
  onStartInterview,
}: FileUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="mt-2 w-full max-w-xl rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 shadow-lg shadow-slate-950/30">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);

          const dropped = event.dataTransfer.files?.[0];
          if (!dropped) {
            return;
          }
          onFileSelected(dropped);
        }}
        className={cn(
          'rounded-2xl border-2 border-dashed p-5 text-center transition-all',
          isDragging
            ? 'border-teal-300 bg-teal-400/10'
            : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/60',
          file && 'border-teal-300/70 bg-teal-400/10'
        )}
      >
        <input
          id="resume-upload-input"
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={(event) => {
            const selected = event.target.files?.[0];
            if (!selected) {
              return;
            }
            onFileSelected(selected);
          }}
        />

        <label
          htmlFor="resume-upload-input"
          aria-label="Upload a PDF or DOCX resume"
          onClick={() => inputRef.current?.click()}
          className="block w-full cursor-pointer"
        >
          <UploadCloud className="mx-auto mb-2 h-7 w-7 text-teal-300" aria-hidden="true" />
          <p className="text-sm font-semibold text-slate-100">
            {isDragging ? 'Release to upload your resume' : 'Drag and drop your resume'}
          </p>
          <p className="mt-1 text-xs text-slate-400">or click to browse PDF, DOCX files</p>
        </label>
      </div>

      {file && (
        <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 shrink-0 text-teal-300" aria-hidden="true" />
                <p className="truncate text-sm font-medium text-slate-100">{file.name}</p>
              </div>
              <p className="mt-1 text-xs text-slate-400">{formatFileSize(file.size)}</p>
            </div>

            <button
              type="button"
              onClick={onRemoveFile}
              aria-label="Remove uploaded resume"
              className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-400 transition hover:border-red-500/50 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="mt-3 overflow-hidden rounded-full border border-slate-700 bg-slate-900/80">
          <div className="h-2 w-full bg-slate-900">
            <motion.div
              aria-hidden="true"
              className="h-full w-1/3 bg-gradient-to-r from-transparent via-teal-300 to-transparent"
              animate={{ x: ['-120%', '320%'] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </div>
      )}

      {file && (
        <button
          type="button"
          onClick={onStartInterview}
          disabled={isUploading}
          aria-label="Start interview with uploaded resume"
          className={cn(
            'mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all',
            !isUploading
              ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-white hover:brightness-110 active:scale-[0.98]'
              : 'cursor-not-allowed bg-slate-800 text-slate-500'
          )}
        >
          {isUploading ? 'Analyzing Resume...' : 'Start Interview'}
        </button>
      )}
    </div>
  );
}
