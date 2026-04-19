const API_BASE_URL =
  process.env.NEXT_PUBLIC_RESUME_BUILDER_API_URL ||
  "http://127.0.0.1:8000";

const ENDPOINTS = {
  generate: "/generate-resume",
  improve: "/improve-section",
  keywords: "/extract-keywords",
};

const getBaseUrl = () => API_BASE_URL.replace(/\/$/, "");

function splitToItems(value, separatorRegex) {
  if (Array.isArray(value)) return value.filter(Boolean).map((item) => String(item).trim()).filter(Boolean);
  if (typeof value !== "string") return [];

  return value
    .split(separatorRegex)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeResumeRequest(payload) {
  if (!payload || typeof payload !== "object") {
    return {
      personal_info: {},
      summary: "",
      skills: [],
      experience: [],
      education: [],
      projects: [],
      template: "classic",
    };
  }

  // Supports both legacy flat payload and structured payload.
  const personalInfo = payload.personal_info || payload.personalInfo || {
    name: payload.name || "",
    email: payload.email || "",
    phone: payload.phone || "",
    location: payload.location || "",
    linkedin: payload.linkedin || "",
    portfolio: payload.portfolio || "",
  };

  const summary = payload.summary || "";
  const skills = splitToItems(payload.skills, /[,\n]/g);

  const experience = Array.isArray(payload.experience)
    ? payload.experience
    : splitToItems(payload.experience, /\n/g).map((item) => ({
        title: item,
        company: "",
        duration: "",
        description: "",
      }));

  const education = Array.isArray(payload.education)
    ? payload.education
    : splitToItems(payload.education, /\n/g).map((item) => ({
        degree: item,
        institution: "",
        year: "",
      }));

  const projects = Array.isArray(payload.projects)
    ? payload.projects
    : splitToItems(payload.projects, /\n/g).map((item) => ({
        name: item,
        description: "",
        technologies: [],
      }));

  return {
    personal_info: personalInfo,
    summary,
    skills,
    experience,
    education,
    projects,
    template: payload.template || "classic",
  };
}

async function parseError(response) {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  const detail = data?.detail;
  const detailMessage = Array.isArray(detail)
    ? detail.map((entry) => entry?.msg || JSON.stringify(entry)).join("; ")
    : detail;

  return (
    detailMessage ||
    data?.message ||
    data?.error ||
    `Request failed with HTTP ${response.status}`
  );
}

function triggerDownload(blob, fileName) {
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return objectUrl;
}

function toBlobFromBase64(base64String, mimeType = "application/pdf") {
  const binary = atob(base64String);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type: mimeType });
}

export async function generateResume(resumeData, options = {}) {
  const { autoDownload = false, fileName = "AI_Resume.pdf" } = options;
  const payload = normalizeResumeRequest(resumeData);

  const response = await fetch(`${getBaseUrl()}${ENDPOINTS.generate}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const contentType = response.headers.get("content-type") || "";
  const resolvedFileName =
    fileName || `${String(payload?.personal_info?.name || "Resume").replace(/\s+/g, "_")}.pdf`;

  if (contentType.includes("application/pdf") || contentType.includes("application/octet-stream")) {
    const blob = await response.blob();
    const fileURL = autoDownload ? triggerDownload(blob, resolvedFileName) : window.URL.createObjectURL(blob);

    return {
      success: true,
      blob,
      fileURL,
      raw: null,
    };
  }

  const data = await response.json();
  const possibleBase64 =
    data?.pdf_base64 ||
    data?.resume_base64 ||
    data?.base64_pdf ||
    data?.file_base64 ||
    null;

  const downloadUrl =
    data?.download_url ||
    data?.pdf_url ||
    data?.url ||
    null;

  if (possibleBase64) {
    const blob = toBlobFromBase64(possibleBase64, "application/pdf");
    const fileURL = autoDownload ? triggerDownload(blob, resolvedFileName) : window.URL.createObjectURL(blob);

    return {
      success: true,
      blob,
      fileURL,
      raw: data,
    };
  }

  return {
    success: true,
    raw: data,
    fileURL: downloadUrl,
    blob: null,
  };
}

export async function improveResumeSection(request) {
  const response = await fetch(`${getBaseUrl()}${ENDPOINTS.improve}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const data = await response.json();
  const improvedText =
    data?.improved_text ||
    data?.improved_section ||
    data?.improved ||
    data?.result ||
    "";

  return {
    improvedText,
    raw: data,
  };
}

export async function extractResumeKeywords(request) {
  const response = await fetch(`${getBaseUrl()}${ENDPOINTS.keywords}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const data = await response.json();
  const keywords =
    data?.keywords ||
    data?.extracted_keywords ||
    data?.result ||
    [];

  return {
    keywords: Array.isArray(keywords) ? keywords : splitToItems(String(keywords || ""), /[,\n]/g),
    raw: data,
  };
}

export async function buildResume(resumeData) {
  try {
    const fileName = `${String(resumeData?.name || "Resume").replace(/\s+/g, "_")}_AI_Resume.pdf`;
    const result = await generateResume(resumeData, {
      autoDownload: true,
      fileName,
    });

    return {
      success: true,
      fileURL: result.fileURL,
      data: result.raw,
    };
  } catch (error) {
    console.error("Resume build error:", error);
    return {
      success: false,
      message: error?.message || "Failed to generate resume",
    };
  }
}

