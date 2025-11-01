// // services/jobService.js
// import axios from "axios";

// const API_BASE = "/api/v1/job"; // FastAPI router prefix

// export const getJobRecommendation = async (file, jobTitleFilter = "") => {
//   const formData = new FormData();
//   formData.append("resume", file); // must match FastAPI UploadFile param
//   if (jobTitleFilter) formData.append("job_title_filter", jobTitleFilter);

//   try {
//     const response = await axios.post(`${API_BASE}/recommend`, formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return response.data;
//   } catch (err) {
//     console.error("Job recommendation error:", err);
//     throw err.response?.data?.detail || "Failed to get recommendation";
//   }
// };
// //export const recommendJob = getJobRecommendation;

import axios from "axios";

// Use full URL to your FastAPI backend
const API_BASE = "http://localhost:8000/api/v1/job";

export const getJobRecommendation = async (file, jobTitleFilter = "") => {
  const formData = new FormData();
  formData.append("resume", file); // must match FastAPI UploadFile param
  if (jobTitleFilter) formData.append("job_title_filter", jobTitleFilter);

  try {
    const response = await axios.post(`${API_BASE}/recommend`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (err) {
    console.error("Job recommendation error:", err);
    throw err.response?.data?.detail || "Failed to get recommendation";
  }
};
