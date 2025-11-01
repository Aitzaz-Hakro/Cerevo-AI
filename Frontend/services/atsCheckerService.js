import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1/resume";

/**
 * Upload resume to ATS Checker backend
 * @param {File} file - Resume file (PDF or DOCX)
 */
export async function checkATSCompatibility(file) {
  const formData = new FormData();
  formData.append("resume", file); // ⚠ key must match backend param name (resume)

  try {
    const response = await axios.post(`${API_BASE_URL}/ats-check`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("ATS check error:", error);
    throw error.response?.data?.detail || "Error checking ATS compatibility";
  }
}
