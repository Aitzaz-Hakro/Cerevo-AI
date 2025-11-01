import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

export async function analyzeSkillGap(jobDescription, file) {
  const formData = new FormData();
  formData.append("job_description", jobDescription);
  formData.append("resume", file);

  const resp = await axios.post(`${API_BASE_URL}/api/v1/skill-gap/analyze`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return resp.data;
}
