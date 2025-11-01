import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// })
const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000", // ✅ no extra /api
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
})

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default apiClient
