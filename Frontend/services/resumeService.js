const API_BASE = "http://localhost:8000/api/v1/resume";

export const categorizeResumes = async (files) => {
  if (!files || files.length === 0) throw new Error("No files provided");

  const results = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${API_BASE}/predict`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      results.push(response.data);
    } catch (err) {
      console.error("Resume categorization error:", err);
      results.push({
        status: "error",
        message: err.response?.data?.detail || "Failed to categorize",
      });
    }
  }

  return results;
};



