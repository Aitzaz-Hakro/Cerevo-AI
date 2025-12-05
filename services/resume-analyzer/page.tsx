"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Upload } from "lucide-react";

export default function ResumeAnalyzer() {
  const [showResults, setShowResults] = useState(false);

  return (
    <div className="w-full min-h-screen flex justify-center items-start p-4 md:p-10 bg-gray-50">
      {/* Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {/* Results Section */}
        {showResults && (
          <motion.div
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200 flex flex-col gap-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 text-center">Overview (Section Wise)</h2>

            {/* Section List */}
            <div className="flex flex-col gap-4">
              {[{title:"Experience", score:83}, {title:"Skills", score:78}, {title:"Education", score:90}, {title:"Projects", score:50}].map((sec, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50">
                  <div>
                    <p className="text-gray-700 font-medium">{sec.title}</p>
                    <div className="w-40 h-2 bg-gray-300 rounded-full mt-2">
                      <div
                        className="h-2 bg-green-500 rounded-full"
                        style={{ width: `${sec.score}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-green-500 text-green-600 font-semibold">
                    {sec.score}
                  </div>
                </div>
              ))}
            </div>

            {/* Suggestions */}
            <div className="bg-gray-100 border border-gray-200 p-4 rounded-xl">
              <h3 className="font-semibold text-gray-700 mb-2">Suggestions</h3>
              <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
                <li>Add measurable achievements.</li>
                <li>Improve skills section detail.</li>
                <li>Reformat education layout for clarity.</li>
                <li>Add project outcomes and metrics.</li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* Upload Section */}
        <motion.div
          animate={{ x: showResults ? 120 : 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200 flex flex-col items-center justify-center text-center"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload Resume</h2>

          <div className="border-2 border-dashed border-gray-400 rounded-xl w-full p-10 flex flex-col items-center cursor-pointer hover:bg-gray-100 transition">
            <Upload className="w-10 h-10 text-gray-500 mb-3" />
            <p className="text-gray-600">Upload or drag & drop</p>
          </div>

          <button
            onClick={() => setShowResults(true)}
            className="mt-6 px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Analyze
          </button>
        </motion.div>
      </div>
    </div>
  );
}
