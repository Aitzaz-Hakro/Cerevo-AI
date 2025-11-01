
// "use client"

// import { useState } from "react"
// import { motion } from "framer-motion"
// import DashboardNav from "@/components/DashboardNav"
// import { BookOpen, CheckCircle, AlertCircle } from "lucide-react"
// import { generateMCQs, checkAnswers } from "@/services/mcqService"

// export default function MCQGeneratorPage() {
//   const [file, setFile] = useState<File | null>(null)
//   const [text, setText] = useState("")
//   const [numQuestions, setNumQuestions] = useState(5)
//   const [mcqs, setMcqs] = useState<any[]>([])
//   const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({})
//   const [results, setResults] = useState<any>(null)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const handleGenerate = async () => {
//     if (!text.trim() && !file) {
//       alert("Please enter some text or upload a file!")
//       return
//     }

//     setLoading(true)
//     setError(null)
//     setResults(null)
//     setMcqs([])

//     const formData = new FormData()
//     if (file) formData.append("file", file)
//     if (text.trim()) formData.append("text", text)
//     formData.append("num_questions", numQuestions.toString())

//     try {
//       const res = await generateMCQs(formData)
//       setMcqs(res.mcqs || [])
//     } catch (err: any) {
//       setError(err.response?.data?.detail || "Failed to generate MCQs")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCheckAnswers = async () => {
//     const payload = {
//       questions: mcqs.map((q, i) => ({
//         question: q.question,
//         options: q.options,
//         correct_option: q.correct_option,
//         user_choice: userAnswers[i],
//       })),
//     }

//     try {
//       const res = await checkAnswers(payload)
//       setResults(res)
//     } catch {
//       alert("Error checking answers")
//     }
//   }

//   const handleAnswerSelect = (qIndex: number, optIndex: number) => {
//     setUserAnswers((prev) => ({ ...prev, [qIndex]: optIndex }))
//   }

//   return (
//     <div className="flex min-h-screen bg-background">
//       <DashboardNav />
//       <main className="flex-1">
//         <div className="max-w-5xl mx-auto px-6 py-10">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mb-10"
//           >
//             <h1 className="text-3xl font-bold mb-2">AI-Powered MCQ Generator</h1>
//             <p className="text-muted-foreground">
//               Upload a PDF or enter text — get AI-generated MCQs with instant answer validation
//             </p>
//           </motion.div>

//           {/* Input Section */}
//           <div className="bg-card border border-border rounded-xl p-6 mb-10 space-y-4">
//             <textarea
//               placeholder="Enter topic or text here..."
//               className="w-full p-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary"
//               rows={4}
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//             />
//             <input
//               type="file"
//               accept=".pdf,.txt"
//               onChange={(e) => setFile(e.target.files?.[0] || null)}
//               className="block w-full text-sm text-muted-foreground"
//             />
//             <input
//               type="number"
//               min={1}
//               value={numQuestions}
//               onChange={(e) => setNumQuestions(Number(e.target.value))}
//               className="w-full px-3 py-2 border border-border rounded-lg"
//               placeholder="Number of questions"
//             />
//             <button
//               onClick={handleGenerate}
//               disabled={loading}
//               className="w-full py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50"
//             >
//               {loading ? "Generating..." : "Generate MCQs"}
//             </button>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600 flex items-center gap-2 mb-6">
//               <AlertCircle size={18} /> {error}
//             </div>
//           )}

//           {/* Display MCQs */}
//           {mcqs.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="space-y-6"
//             >
//               {mcqs.map((q, qIndex) => (
//                 <div key={qIndex} className="bg-card border border-border rounded-lg p-6">
//                   <h3 className="font-semibold mb-4 text-lg">
//                     {qIndex + 1}. {q.question}
//                   </h3>
//                   <div className="grid gap-3">
//                     {q.options.map((opt: string, optIndex: number) => {
//                       const isSelected = userAnswers[qIndex] === optIndex
//                       const correctOption = results?.details?.[qIndex]?.correct_answer
//                       const selectedAnswer = results?.details?.[qIndex]?.selected_answer
//                       const isCorrect =
//                         results && selectedAnswer === correctOption && isSelected

//                       return (
//                         <motion.button
//                           whileHover={{ scale: 1.01 }}
//                           key={optIndex}
//                           onClick={() => handleAnswerSelect(qIndex, optIndex)}
//                           disabled={!!results}
//                           className={`w-full text-left p-3 rounded-lg border transition ${
//                             isSelected
//                               ? "bg-blue-500/10 border-blue-500"
//                               : "bg-muted border-border hover:border-primary/50"
//                           } ${isCorrect ? "bg-green-500/10 border-green-500" : ""}`}
//                         >
//                           {opt}
//                         </motion.button>
//                       )
//                     })}
//                   </div>
//                 </div>
//               ))}
//             </motion.div>
//           )}

//           {/* Submit Answers */}
//           {mcqs.length > 0 && !results && (
//             <div className="mt-8">
//               <button
//                 onClick={handleCheckAnswers}
//                 className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:shadow-md"
//               >
//                 Submit Answers
//               </button>
//             </div>
//           )}

//           {/* Results */}
//           {results && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="mt-10 bg-card border border-border rounded-lg p-6"
//             >
//               <h2 className="text-2xl font-semibold mb-4">
//                 Results: {results.score_percent}% ({results.correct_answers}/{results.total_questions})
//               </h2>
//               {results.details.map((res: any, i: number) => (
//                 <div
//                   key={i}
//                   className={`p-4 rounded-lg mb-3 ${
//                     res.is_correct
//                       ? "bg-green-500/10 border border-green-500/40"
//                       : "bg-red-500/10 border border-red-500/40"
//                   }`}
//                 >
//                   <p className="font-medium">{res.question}</p>
//                   <p className="text-sm mt-1">
//                     ✅ Correct Answer: <strong>{res.correct_answer}</strong>
//                   </p>
//                   {!res.is_correct && (
//                     <p className="text-sm text-destructive">
//                       ❌ You selected: {res.selected_answer}
//                     </p>
//                   )}
//                 </div>
//               ))}
//               <button
//                 onClick={() => {
//                   setResults(null)
//                   setUserAnswers({})
//                 }}
//                 className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg"
//               >
//                 Try Again
//               </button>
//             </motion.div>
//           )}

//           {!mcqs.length && !loading && !error && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="text-center py-12 bg-card border border-border rounded-lg"
//             >
//               <BookOpen className="mx-auto text-muted-foreground mb-4" size={48} />
//               <p className="text-muted-foreground">
//                 Enter text or upload a PDF to generate AI-based MCQs
//               </p>
//             </motion.div>
//           )}
//         </div>
//       </main>
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import DashboardNav from "@/components/DashboardNav"
import { BookOpen, CheckCircle, AlertCircle, Upload } from "lucide-react"
import { generateMCQs, checkAnswers } from "@/services/mcqService"

export default function MCQGeneratorPage() {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState("")
  const [numQuestions, setNumQuestions] = useState(5)
  const [mcqs, setMcqs] = useState<any[]>([])
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({})
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 🧠 Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  // ⚙️ Generate MCQs
  const handleGenerate = async () => {
    if (!text.trim() && !file) {
      alert("Please enter text or upload a PDF/TXT file!")
      return
    }

    setLoading(true)
    setError(null)
    setResults(null)
    setMcqs([])

    const formData = new FormData()
    if (file) formData.append("file", file)
    if (text.trim()) formData.append("text", text)
    formData.append("num_questions", numQuestions.toString())

    try {
      const res = await generateMCQs(formData)
      setMcqs(res.mcqs || [])
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to generate MCQs")
    } finally {
      setLoading(false)
    }
  }

  // ✅ Check Answers
  const handleCheckAnswers = async () => {
    const payload = {
      questions: mcqs.map((q, i) => ({
        question: q.question,
        options: q.options,
        correct_option: q.correct_option,
        user_choice: userAnswers[i],
      })),
    }

    try {
      const res = await checkAnswers(payload)
      setResults(res)
    } catch {
      alert("Error checking answers")
    }
  }

  // 📝 Select Option
  const handleAnswerSelect = (qIndex: number, optIndex: number) => {
    setUserAnswers((prev) => ({ ...prev, [qIndex]: optIndex }))
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="text-3xl font-bold mb-2">📘 AI-Powered MCQ Generator</h1>
            <p className="text-muted-foreground">
              Upload a PDF or enter text — get instant AI-generated MCQs with interactive answers
            </p>
          </motion.div>

          {/* Input Section */}
          <div className="bg-card border border-border rounded-xl p-6 mb-10 space-y-5">
            <textarea
              placeholder="Enter text or topic here..."
              className="w-full p-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary"
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-primary/10 border border-primary/30 rounded-lg hover:bg-primary/20">
                <Upload size={18} />
                <span>Upload PDF/TXT File</span>
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {file && (
                <span className="text-sm text-muted-foreground">
                  📄 {file.name}
                </span>
              )}
            </div>

            <input
              type="number"
              min={1}
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-lg"
              placeholder="Number of questions"
            />

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate MCQs"}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600 flex items-center gap-2 mb-6">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {/* Display MCQs */}
          {mcqs.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {mcqs.map((q, qIndex) => (
                <div key={qIndex} className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold mb-4 text-lg">
                    {qIndex + 1}. {q.question}
                  </h3>
                  <div className="grid gap-3">
                    {q.options.map((opt: string, optIndex: number) => {
                      const isSelected = userAnswers[qIndex] === optIndex
                      const correctOption = results?.details?.[qIndex]?.correct_answer
                      const selectedAnswer = results?.details?.[qIndex]?.selected_answer
                      const isCorrect = results && selectedAnswer === correctOption && isSelected

                      return (
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          key={optIndex}
                          onClick={() => handleAnswerSelect(qIndex, optIndex)}
                          disabled={!!results}
                          className={`w-full text-left p-3 rounded-lg border transition ${
                            isSelected
                              ? "bg-blue-500/10 border-blue-500"
                              : "bg-muted border-border hover:border-primary/50"
                          } ${isCorrect ? "bg-green-500/10 border-green-500" : ""}`}
                        >
                          {opt}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Submit Button */}
          {mcqs.length > 0 && !results && (
            <div className="mt-8">
              <button
                onClick={handleCheckAnswers}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:shadow-md"
              >
                Submit Answers
              </button>
            </div>
          )}

          {/* Results */}
          {results && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-10 bg-card border border-border rounded-lg p-6"
            >
              <h2 className="text-2xl font-semibold mb-4">
                🎯 Results: {results.score_percent}% ({results.correct_answers}/{results.total_questions})
              </h2>
              {results.details.map((res: any, i: number) => (
                <div
                  key={i}
                  className={`p-4 rounded-lg mb-3 ${
                    res.is_correct
                      ? "bg-green-500/10 border border-green-500/40"
                      : "bg-red-500/10 border border-red-500/40"
                  }`}
                >
                  <p className="font-medium">{res.question}</p>
                  <p className="text-sm mt-1">
                    ✅ Correct: <strong>{res.correct_answer}</strong>
                  </p>
                  {!res.is_correct && (
                    <p className="text-sm text-destructive">
                      ❌ You selected: {res.selected_answer}
                    </p>
                  )}
                </div>
              ))}
              <button
                onClick={() => {
                  setResults(null)
                  setUserAnswers({})
                }}
                className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* Default Info */}
          {!mcqs.length && !loading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-card border border-border rounded-lg"
            >
              <BookOpen className="mx-auto text-muted-foreground mb-4" size={48} />
              <p className="text-muted-foreground">
                Enter text or upload a file to generate AI-based MCQs
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
