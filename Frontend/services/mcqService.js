import axios from "axios"

const BASE_URL = "http://127.0.0.1:8000/api/v1/mcq"

export const generateMCQs = async (formData) => {
  const res = await axios.post(`${BASE_URL}/generate`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return res.data
}

export const checkAnswers = async (payload) => {
  const res = await axios.post(`${BASE_URL}/check-answers`, payload)
  return res.data
}

// import axios from "axios"

// // Use correct base URL for your FastAPI backend
// const BASE_URL = "http://127.0.0.1:8000/api/v1/mcq"

// export const generateMCQs = async (formData) => {
//   const res = await axios.post(`${BASE_URL}/generate`, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   })
//   return res.data
// }

// export const checkAnswers = async (payload) => {
//   const res = await axios.post(`${BASE_URL}/check`, payload)
//   return res.data
// }
