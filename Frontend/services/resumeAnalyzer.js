// export async function analyzeResume(file) {
//   const formData = new FormData();
//   formData.append("file", file);

//   try {
//     const response = await fetch("http://127.0.0.1:8000/api/v1/resume/analyze", {

//       method: "POST",
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to analyze resume: ${response.statusText}`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error analyzing resume:", error);
//     throw error;
//   }
// }

export async function analyzeResume(file) {
  const formData = new FormData();
  formData.append("file", file);

  const endpoint =
    process.env.NEXT_PUBLIC_RESUME_ANALYZER_URL ||
    "https://web-production-3d3ea7.up.railway.app/analyze_resume";

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let details = "";
    try {
      const errorBody = await response.json();
      details = errorBody?.detail || errorBody?.message || "";
    } catch {
      details = "";
    }

    throw new Error(
      details
        ? `Failed to analyze resume: ${details}`
        : `Failed to analyze resume (HTTP ${response.status})`,
    );
  }

  return await response.json();
}

