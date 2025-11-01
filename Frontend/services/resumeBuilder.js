// frontend/services/resumeBuilderService.js

const API_BASE_URL = "http://127.0.0.1:8000/api/v1/resume"; // your FastAPI backend base

export const buildResume = async (resumeData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/build-resume`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resumeData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Error generating resume");
    }

    // Since backend sends a PDF file, we must handle it as a Blob
    const blob = await response.blob();
    const fileURL = window.URL.createObjectURL(blob);

    // Auto download
    const link = document.createElement("a");
    link.href = fileURL;
    link.download = `${resumeData.name.replace(/\s+/g, "_")}_AI_Resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { success: true, fileURL };
  } catch (error) {
    console.error("❌ Resume build error:", error);
    return { success: false, message: error.message };
  }
};

