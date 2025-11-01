"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import DashboardNav from "@/components/DashboardNav"
import ResultCard from "@/components/ResultCard"
import { useApi } from "@/hooks/useApi"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlertCircle, BarChart3 } from "lucide-react"

export default function JobMarketPage() {
  const { data, loading, error, request } = useApi()
  const [skill, setSkill] = useState("python")
  const [monthsPredict, setMonthsPredict] = useState(12)
  const [minMonths, setMinMonths] = useState(6)
  const [overview, setOverview] = useState<any>(null)
  const [salaryTrend, setSalaryTrend] = useState<any[]>([])
  const [trendData, setTrendData] = useState<any[]>([])
  const [locations, setLocations] = useState<any[]>([])

  // Fetch Overview
  const fetchOverview = async () => {
    const res = await request("get", `/api/v1/dashboard/overview?skill=${skill}`)
    setOverview(res)
  }

  // Fetch Salary Trend
  const fetchSalary = async () => {
    const res = await request("get", `/api/v1/dashboard/salary?skill=${skill}&n_months=10`)
    setSalaryTrend(res.salary_trend)
  }

  // Fetch Trend Prediction
  const fetchTrends = async () => {
    const res = await request(
      "get",
      `/api/v1/dashboard/trends?skill=${skill}&months_predict=${monthsPredict}&min_months_for_model=${minMonths}`
    )
    setTrendData(res.predicted_trend || [])
  }

  // Fetch Location Data
  const fetchLocations = async () => {
    const res = await request("get", `/api/v1/dashboard/location?skill=${skill}&top_n=10`)
    setLocations(res.locations || [])
  }

  const handleSearch = async () => {
    await Promise.all([fetchOverview(), fetchSalary(), fetchTrends(), fetchLocations()])
  }

  useEffect(() => {
    handleSearch()
  }, [])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF", "#F50057", "#2979FF"]

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="text-3xl font-bold mb-2">AI-Powered Job Market Dashboard</h1>
            <p className="text-muted-foreground">
              Enter a skill to explore job trends, salaries, and locations using predictive analytics
            </p>
          </motion.div>

          {/* Input Section */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            <Input placeholder="Skill (e.g. python)" value={skill} onChange={(e) => setSkill(e.target.value)} />
            <Input
              placeholder="Months Predict"
              type="number"
              value={monthsPredict}
              onChange={(e) => setMonthsPredict(Number(e.target.value))}
            />
            <Input
              placeholder="Min Months for Model"
              type="number"
              value={minMonths}
              onChange={(e) => setMinMonths(Number(e.target.value))}
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? "Loading..." : "Fetch Insights"}
            </Button>
          </div>

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-3"
            >
              <AlertCircle className="text-destructive flex-shrink-0" size={20} />
              <div>
                <h3 className="font-semibold text-destructive">Error</h3>
                <p className="text-sm text-destructive/80">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Overview Section */}
          {overview && (
            <ResultCard title="📊 Overview Summary">
              <p><strong>Skill:</strong> {overview.skill}</p>
              <p><strong>Total Postings:</strong> {overview.total_postings}</p>
              <p><strong>Average Salary:</strong> ${overview.avg_salary?.toLocaleString()}</p>
            </ResultCard>
          )}

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Locations Pie Chart */}
            {locations.length > 0 && (
              <ResultCard title="🌍 Top Hiring Locations">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={locations} dataKey="count" nameKey="location" outerRadius={120} label>
                      {locations.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ResultCard>
            )}

            {/* Job Trends Line Chart */}
            {trendData.length > 0 && (
              <ResultCard title="📈 Predicted Job Market Trend">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="job_count" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ResultCard>
            )}

            {/* Salary Trend Chart */}
            {salaryTrend.length > 0 && (
              <ResultCard title="💰 Salary Trends Over Time">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salaryTrend}>
                    <XAxis dataKey="year_month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="avg_salary" stroke="#00C49F" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ResultCard>
            )}

            {/* Recent Monthly Jobs Bar Chart */}
            {overview?.recent_monthly?.length > 0 && (
              <ResultCard title="📅 Recent Monthly Job Openings">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={overview.recent_monthly}>
                    <XAxis dataKey="year_month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="job_count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </ResultCard>
            )}
          </div>

          {/* Empty State */}
          {!overview && !loading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-card border border-border rounded-lg"
            >
              <BarChart3 className="mx-auto text-muted-foreground mb-4" size={48} />
              <p className="text-muted-foreground">Enter a skill to view analytics</p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}





