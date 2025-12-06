"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateMCQs } from "@/services/mcqService";
import {
  FileText,
  AlertCircle,
  CheckCircle,
  Sparkles,
  RefreshCw,
  ArrowRight,
  Brain,
  Lightbulb,
  Trophy,
  BookOpen,
  Zap,
  ChevronRight,
  RotateCcw,
  Award
} from "lucide-react";
import Link from "next/link";

interface MCQuestion {
  question: string;
  options: string[];
  correct_option: number;
}

export default function MCQGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [questions, setQuestions] = useState<MCQuestion[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Quiz state
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
  const [showResults, setShowResults] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setQuestions(null);
    setQuizMode(false);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);

    try {
      const formData = new FormData();
      formData.append("topic", topic);
      formData.append("num_questions", numQuestions.toString());
      formData.append("difficulty", difficulty);
      const response = await generateMCQs(formData);
      // Handle API response format: { mcqs: [{ question, options[], correct_option }] }
      const mcqs = response?.mcqs || response?.questions || [];
      setQuestions(Array.isArray(mcqs) ? mcqs : []);
    } catch (err: any) {
      setError(err?.message || err || "Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTopic("");
    setQuestions(null);
    setError(null);
    setQuizMode(false);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const startQuiz = () => {
    setQuizMode(true);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const handleSelectAnswer = (questionIndex: number, optionIndex: number) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleNext = () => {
    if (questions && currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!questions) return 0;
    let correct = 0;
    questions.forEach((q, i) => {
      const selected = selectedAnswers[i];
      if (selected !== undefined && selected === q.correct_option) {
        correct++;
      }
    });
    return correct;
  };

  const getOptionText = (option: string): string => {
    return option;
  };

  const isCorrectOption = (question: MCQuestion, optionIndex: number): boolean => {
    return question.correct_option === optionIndex;
  };

  const difficultyOptions = [
    { value: "easy", label: "Easy", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
    { value: "medium", label: "Medium", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
    { value: "hard", label: "Hard", color: "text-red-500 bg-red-500/10 border-red-500/20" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
              <Brain size={16} className="text-purple-500" />
              <span className="text-sm font-medium text-purple-500">AI-Powered</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                MCQ
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                Generator
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Generate practice questions on any topic instantly. Test your knowledge 
              and prepare for interviews with AI-generated MCQs.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {[
                { icon: Zap, text: "Instant Generation" },
                { icon: Lightbulb, text: "Any Topic" },
                { icon: Trophy, text: "Track Progress" },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-card/50 border border-border/50 rounded-full">
                  <feature.icon size={16} className="text-purple-500" />
                  <span className="text-sm">{feature.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

            {/* Input Panel */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-4"
            >
              <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 lg:sticky lg:top-24 space-y-5">
                {/* Topic Input */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                      <BookOpen className="text-purple-500" size={22} />
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg">Topic</h2>
                      <p className="text-xs text-muted-foreground">What do you want to learn?</p>
                    </div>
                  </div>

                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic (e.g., React Hooks, Python Data Structures, Machine Learning basics)..."
                    className="w-full h-28 p-4 bg-muted/30 border border-border rounded-xl
                    text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/30
                    placeholder:text-muted-foreground/50 transition-all"
                  />
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  {/* Number of Questions */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Number of Questions</label>
                    <div className="flex gap-2">
                      {[5, 10, 15, 20].map((num) => (
                        <button
                          key={num}
                          onClick={() => setNumQuestions(num)}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all
                          ${numQuestions === num
                            ? "bg-purple-500 text-white"
                            : "bg-muted/50 hover:bg-muted text-muted-foreground"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Difficulty</label>
                    <div className="flex gap-2">
                      {difficultyOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setDifficulty(opt.value)}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all border
                          ${difficulty === opt.value ? opt.color : "bg-muted/50 border-transparent text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleGenerate}
                    disabled={!topic.trim() || loading}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                    text-white font-semibold transition-all duration-300
                    ${topic.trim() && !loading
                      ? "bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02]"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        Generate Questions
                      </>
                    )}
                  </button>

                  {questions && questions.length > 0 && !quizMode && (
                    <button
                      onClick={startQuiz}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                      bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold
                      hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                    >
                      <Trophy size={18} />
                      Start Quiz
                    </button>
                  )}

                  {questions && (
                    <button
                      onClick={handleReset}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                      border border-border hover:bg-muted transition-all text-sm"
                    >
                      <RotateCcw size={16} />
                      New Topic
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Results Panel */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                {/* Loading */}
                {loading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-24 bg-card border border-border rounded-2xl"
                  >
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-purple-500/20 rounded-full" />
                      <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Brain size={24} className="text-purple-500" />
                      </div>
                    </div>
                    <p className="mt-6 text-lg font-medium">Generating questions...</p>
                    <p className="text-sm text-muted-foreground mt-1">AI is crafting your MCQs</p>
                  </motion.div>
                )}

                {/* Error */}
                {error && !loading && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-destructive/10 border border-destructive/30 rounded-2xl flex items-start gap-4"
                  >
                    <div className="p-2 bg-destructive/20 rounded-lg">
                      <AlertCircle className="text-destructive" size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-destructive">Generation Failed</h4>
                      <p className="text-sm text-destructive/80 mt-1">{error}</p>
                      <button onClick={handleReset} className="mt-3 text-sm text-destructive hover:underline">
                        Try again
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Empty State */}
                {!questions && !loading && !error && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 sm:py-28 bg-card border border-border rounded-2xl"
                  >
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 mb-6">
                      <Lightbulb size={48} className="text-purple-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Generate Practice Questions</h3>
                    <p className="text-muted-foreground text-center max-w-sm px-4 mb-6">
                      Enter any topic and let AI create multiple choice questions to test your knowledge.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['Programming', 'Data Science', 'Web Dev', 'System Design'].map((item) => (
                        <button
                          key={item}
                          onClick={() => setTopic(item)}
                          className="px-3 py-1.5 bg-muted/50 hover:bg-purple-500/10 rounded-full text-xs text-muted-foreground hover:text-purple-500 transition-colors"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Questions Generated - View Mode */}
                {questions && questions.length > 0 && !quizMode && !loading && (
                  <motion.div
                    key="questions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">Generated Questions</h3>
                      <span className="text-sm text-muted-foreground">{questions.length} questions</span>
                    </div>
                    
                    {questions.map((q, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-card border border-border rounded-xl p-5"
                      >
                        <div className="flex gap-3 mb-4">
                          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 font-semibold text-sm flex items-center justify-center">
                            {i + 1}
                          </span>
                          <p className="font-medium">{q.question}</p>
                        </div>
                        <div className="grid gap-2 pl-11">
                          {q.options.map((opt, j) => (
                            <div
                              key={j}
                              className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-transparent"
                            >
                              <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                                {String.fromCharCode(65 + j)}
                              </span>
                              <span className="text-sm">{getOptionText(opt)}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Quiz Mode */}
                {questions && questions.length > 0 && quizMode && !loading && (
                  <motion.div
                    key="quiz"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    {/* Progress Bar */}
                    <div className="bg-card border border-border rounded-xl p-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{currentQuestion + 1} / {questions.length}</span>
                      </div>
                      <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Question Card */}
                    {!showResults ? (
                      <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-card border border-border rounded-2xl p-6"
                      >
                        <div className="flex gap-4 mb-6">
                          <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 font-bold flex items-center justify-center">
                            {currentQuestion + 1}
                          </span>
                          <h3 className="text-lg font-medium">{questions[currentQuestion].question}</h3>
                        </div>

                        <div className="grid gap-3">
                          {questions[currentQuestion].options.map((opt, j) => {
                            const isSelected = selectedAnswers[currentQuestion] === j;
                            return (
                              <button
                                key={j}
                                onClick={() => handleSelectAnswer(currentQuestion, j)}
                                className={`flex items-center gap-4 p-4 rounded-xl text-left transition-all
                                ${isSelected
                                  ? "bg-purple-500/10 border-2 border-purple-500"
                                  : "bg-muted/30 border-2 border-transparent hover:border-purple-500/30"
                                }`}
                              >
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                                ${isSelected ? "bg-purple-500 text-white" : "bg-muted"}`}>
                                  {String.fromCharCode(65 + j)}
                                </span>
                                <span className="flex-1">{getOptionText(opt)}</span>
                                {isSelected && <CheckCircle size={20} className="text-purple-500" />}
                              </button>
                            );
                          })}
                        </div>

                        {/* Navigation */}
                        <div className="flex justify-between mt-6 pt-4 border-t border-border">
                          <button
                            onClick={handlePrevious}
                            disabled={currentQuestion === 0}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm
                            disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                          >
                            <ChevronRight size={16} className="rotate-180" />
                            Previous
                          </button>

                          {currentQuestion === questions.length - 1 ? (
                            <button
                              onClick={handleSubmit}
                              disabled={Object.keys(selectedAnswers).length !== questions.length}
                              className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold
                              bg-gradient-to-r from-purple-500 to-pink-500 text-white
                              disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                            >
                              Submit Quiz
                              <Trophy size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={handleNext}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm
                              bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 transition-colors"
                            >
                              Next
                              <ChevronRight size={16} />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      /* Results */
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                      >
                        {/* Score Card */}
                        <div className="bg-card border border-border rounded-2xl p-8 text-center">
                          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 w-fit mx-auto mb-4">
                            <Award size={48} className="text-purple-500" />
                          </div>
                          <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
                          <p className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                            {calculateScore()} / {questions.length}
                          </p>
                          <p className="text-muted-foreground">
                            {Math.round((calculateScore() / questions.length) * 100)}% correct
                          </p>
                        </div>

                        {/* Answers Review */}
                        <div className="space-y-4">
                          <h3 className="font-semibold">Review Answers</h3>
                          {questions.map((q, i) => {
                            const selected = selectedAnswers[i];
                            const isCorrect = isCorrectOption(q, selected);
                            return (
                              <div
                                key={i}
                                className={`p-4 rounded-xl border ${isCorrect ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"}`}
                              >
                                <div className="flex gap-3 mb-3">
                                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${isCorrect ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
                                    {isCorrect ? "✓" : "✗"}
                                  </span>
                                  <p className="font-medium text-sm">{q.question}</p>
                                </div>
                                <p className="text-sm text-muted-foreground pl-9">
                                  Your answer: {getOptionText(q.options[selected])}
                                </p>
                                {!isCorrect && (
                                  <p className="text-sm text-emerald-500 pl-9 mt-1">
                                    Correct: {q.options.map((opt, idx) => isCorrectOption(q, idx) ? getOptionText(opt) : null).filter(Boolean)[0]}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={startQuiz}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
                            bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold
                            hover:shadow-lg transition-all"
                          >
                            <RotateCcw size={18} />
                            Retry Quiz
                          </button>
                          <button
                            onClick={handleReset}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
                            border border-border hover:bg-muted transition-all"
                          >
                            <Sparkles size={18} />
                            New Topic
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* CTA Banner */}
                    {showResults && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-rose-500/10 border border-purple-500/20 rounded-2xl p-6 sm:p-8"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg sm:text-xl font-bold mb-2">
                              Track your progress
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Sign up to save your quiz history and track improvement over time.
                            </p>
                          </div>
                          <Link
                            href="/signup"
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                            bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold
                            hover:shadow-lg hover:shadow-purple-500/25 transition-all shrink-0"
                          >
                            Sign Up Free
                            <ArrowRight size={18} />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
