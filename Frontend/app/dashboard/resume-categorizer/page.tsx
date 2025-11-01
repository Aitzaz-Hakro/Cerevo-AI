// "use client";

// import { useState } from "react";
// import { motion } from "framer-motion";
// import DashboardNav from "@/components/DashboardNav";
// import FileUploader from "@/components/FileUploader";
// import { FileText, AlertCircle } from "lucide-react";
// import { categorizeResumes } from "@/services/resumeService";

// export default function ResumeCategorizer() {
//   const [files, setFiles] = useState<File[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [results, setResults] = useState<any[]>([]);

//   const handleFileSelect = (selectedFile: File | File[]) => {
//     if (Array.isArray(selectedFile)) setFiles(selectedFile);
//     else setFiles([selectedFile]);
//   };

//   const handleAnalyze = async () => {
//     if (files.length === 0) {
//       alert("Please upload at least one resume");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setResults([]);

//     try {
//       const response = await categorizeResumes(files);
//       setResults(response);
//     } catch (err: any) {
//       console.error("Error:", err);
//       setError(String(err));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-background">
//       <DashboardNav />
//       <main className="flex-1">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
//             <h1 className="text-3xl font-bold mb-2">Resume Categorizer</h1>
//             <p className="text-muted-foreground">
//               Automatically classify your resumes into categories like Data Scientist, Web Developer, Data Analyst.
//             </p>
//           </motion.div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Sidebar */}
//             <div className="lg:col-span-1">
//               <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-card border border-border rounded-lg p-6 sticky top-24">
//                 <h2 className="font-semibold mb-4">Upload Resumes</h2>
//                 <div className="space-y-4">
//                   <FileUploader onFileSelect={handleFileSelect} label="Upload your resume(s)" multiple />
//                   <button
//                     onClick={handleAnalyze}
//                     disabled={loading || files.length === 0}
//                     className="w-full py-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
//                   >
//                     {loading ? "Analyzing..." : "Analyze Resume(s)"}
//                   </button>
//                 </div>
//               </motion.div>
//             </div>

//             {/* Main Results */}
//             <div className="lg:col-span-2 space-y-4">
//               {loading && (
//                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
//                   <div className="inline-block">
//                     <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
//                   </div>
//                   <p className="mt-4 text-muted-foreground">Categorizing resumes...</p>
//                 </motion.div>
//               )}

//               {error && (
//                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-3">
//                   <AlertCircle className="text-destructive flex-shrink-0" size={20} />
//                   <div>
//                     <h3 className="font-semibold text-destructive">Error</h3>
//                     <p className="text-sm text-destructive/80">{error}</p>
//                   </div>
//                 </motion.div>
//               )}

//               {results.map((res, idx) => (
//                 <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition">
//                   {res.status === "success" ? (
//                     <>
//                       <h3 className="font-semibold text-lg mb-2">Resume {idx + 1}</h3>
//                       <p className="text-2xl font-bold text-primary mb-2">{res.predicted_category}</p>
//                     </>
//                   ) : (
//                     <p className="text-destructive">Error: {res.message}</p>
//                   )}
//                 </motion.div>
//               ))}

//               {!loading && results.length === 0 && !error && (
//                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 bg-card border border-border rounded-lg">
//                   <FileText className="mx-auto text-muted-foreground mb-4" size={48} />
//                   <p className="text-muted-foreground">Upload a resume to get started</p>
//                 </motion.div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import DashboardNav from "@/components/DashboardNav";
import FileUploader from "@/components/FileUploader";
import { FileText, AlertCircle } from "lucide-react";
import { categorizeResumes } from "@/services/resumeService";
//import React, { useState, useRef } from "react";

export default function ResumeCategorizer() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handleFileSelect = (selectedFile: File | File[]) => {
    if (Array.isArray(selectedFile)) setFiles(selectedFile);
    else setFiles([selectedFile]);
  };

  const handleAnalyze = async () => {
    if (files.length === 0) {
      alert("Please upload at least one resume");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const response = await categorizeResumes(files);
      setResults(response);
    } catch (err: any) {
      console.error("Error:", err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="text-3xl font-bold mb-2">Resume Categorizer</h1>
            <p className="text-muted-foreground">
              Automatically classify your resumes into categories like Data Scientist, Web Developer, Data Analyst.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <h2 className="font-semibold mb-4">Upload Resumes</h2>
                <div className="space-y-4">
                  <FileUploader onFileSelect={handleFileSelect} label="Upload your resume(s)" multiple />
                  <button
                    onClick={handleAnalyze}
                    disabled={loading || files.length === 0}
                    className="w-full py-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                  >
                    {loading ? "Analyzing..." : "Analyze Resume(s)"}
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <div className="inline-block">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  </div>
                  <p className="mt-4 text-muted-foreground">Categorizing resumes...</p>
                </motion.div>
              )}

              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-3">
                  <AlertCircle className="text-destructive flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-semibold text-destructive">Error</h3>
                    <p className="text-sm text-destructive/80">{error}</p>
                  </div>
                </motion.div>
              )}

              {results.map((res, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition">
                  {res.status === "success" ? (
                    <>
                      <h3 className="font-semibold text-lg mb-2">Resume {idx + 1}</h3>
                      <p className="text-2xl font-bold text-primary mb-2">{res.predicted_category}</p>
                    </>
                  ) : (
                    <p className="text-destructive">Error: {res.message}</p>
                  )}
                </motion.div>
              ))}

              {!loading && results.length === 0 && !error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 bg-card border border-border rounded-lg">
                  <FileText className="mx-auto text-muted-foreground mb-4" size={48} />
                  <p className="text-muted-foreground">Upload a resume to get started</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
