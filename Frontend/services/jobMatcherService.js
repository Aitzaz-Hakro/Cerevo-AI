
import axios from "axios"

const API_BASE_URL = "http://127.0.0.1:8000"

export async function matchResumes(jobDescription, files) {
  const formData = new FormData()
  formData.append("job_description", jobDescription)
  files.forEach((file) => formData.append("resumes", file))

  try {
    const response = await axios.post(`${API_BASE_URL}/api/v1/job-matcher/semantic-match`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error) {
    console.error("Error matching resumes:", error)
    throw error.response?.data?.detail || "Failed to match resumes"
  }
}


// import axios from "axios"

// const API_BASE_URL = "http://127.0.0.1:8000"

// export async function matchResumes(jobDescription: string, files: File[]) {
//   const formData = new FormData()
//   formData.append("job_description", jobDescription)
//   files.forEach((file) => formData.append("resumes", file))

//   try {
//     const response = await axios.post(`${API_BASE_URL}/api/v1/job-matcher/semantic-match`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     })
//     return response.data
//   } catch (error: any) {
//     console.error("Error matching resumes:", error)
//     throw error.response?.data?.detail || "Failed to match resumes"
//   }
// }
