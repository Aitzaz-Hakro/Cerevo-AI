import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_ATS_API_URL ||
  "https://atsscorechecker-production-3219.up.railway.app/";

const getBaseUrl = () => API_BASE_URL.replace(/\/$/, "");

const ATS_ENDPOINTS = ["/ats-check", "/analyze", "/analyze_resume"];
const FILE_KEYS = ["resume", "resume_file", "file"];

function toNumber(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  if (numeric <= 1) return Math.round(numeric * 100);
  return Math.max(0, Math.min(100, Math.round(numeric)));
}

function normalizeCriteria(criteria) {
  if (!criteria || typeof criteria !== "object") return {};

  const normalized = {};
  Object.entries(criteria).forEach(([key, value]) => {
    if (value && typeof value === "object") {
      normalized[key] = {
        score: toNumber(value.score),
        feedback: String(value.feedback || "No feedback provided."),
      };
      return;
    }

    normalized[key] = {
      score: toNumber(value),
      feedback: "No feedback provided.",
    };
  });

  return normalized;
}

function normalizeAtsResponse(payload) {
  const source = payload?.data || payload || {};
  const overallScore =
    source.overall_score ??
    source.ats_score ??
    source.score ??
    source.final_score ??
    0;

  return {
    overall_score: toNumber(overallScore),
    criteria: normalizeCriteria(source.criteria || source.breakdown || {}),
    final_feedback: String(
      source.final_feedback ||
      source.summary ||
      source.feedback ||
      "No final feedback provided by the API."
    ),
  };
}

function buildErrorMessage(error) {
  const detail = error?.response?.data?.detail;
  const detailMessage = Array.isArray(detail)
    ? detail.map((entry) => entry?.msg || JSON.stringify(entry)).join("; ")
    : detail;

  return (
    detailMessage ||
    error?.response?.data?.message ||
    (typeof error?.response?.data === "string" ? error.response.data : null) ||
    error?.message ||
    "Error checking ATS compatibility"
  );
}

/**
 * Upload resume to ATS Checker backend
 * @param {File} file - Resume file (PDF or DOCX)
 */
export async function checkATSCompatibility(file) {
  if (!file) {
    throw new Error("Please upload a resume file");
  }

  const baseUrl = getBaseUrl();
  let lastError = null;

  for (const endpoint of ATS_ENDPOINTS) {
    for (const fileKey of FILE_KEYS) {
      const formData = new FormData();
      formData.append(fileKey, file);

      try {
        const response = await axios.post(`${baseUrl}${endpoint}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 120000,
        });

        return normalizeAtsResponse(response.data);
      } catch (error) {
        lastError = error;
      }
    }
  }

  console.error("ATS check error:", lastError);
  throw new Error(buildErrorMessage(lastError));
}
