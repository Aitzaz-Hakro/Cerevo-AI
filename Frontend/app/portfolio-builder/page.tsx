"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowLeft,
	ArrowRight,
	CheckCircle2,
	Download,
	ExternalLink,
	Loader2,
	Sparkles,
	WandSparkles,
} from "lucide-react";
import apiClient from "@/lib/apiClient";

type BuilderStage = "landing" | "form" | "building";

type TemplateTone = "light" | "dark";

type PortfolioTemplate = {
	id: string;
	name: string;
	tagline: string;
	tone: TemplateTone;
	accent: string;
};

type PortfolioFormData = {
	fullName: string;
	role: string;
	theme: string;
	bio: string;
	skills: string;
	primaryProject: string;
	contactEmail: string;
	callToAction: string;
};

type FieldKey = keyof PortfolioFormData;

type FormStep = {
	key: FieldKey;
	title: string;
	hint: string;
	placeholder: string;
	type: "text" | "textarea" | "email";
};

type BuildApiResponse = {
	id?: string;
	session_id?: string;
	preview_url?: string;
	download_zip?: string;
	preview_html?: string;
	export_url?: string;
	deploy_url?: string;
	status?: string;
};

const templates: PortfolioTemplate[] = [
	{ id: "neo-minimal", name: "Neo Minimal", tagline: "Sharp typography and calm spacing", tone: "light", accent: "from-emerald-400 to-sky-500" },
	{ id: "product-story", name: "Product Story", tagline: "Case-study first, outcomes focused", tone: "light", accent: "from-cyan-400 to-blue-500" },
	{ id: "studio-grid", name: "Studio Grid", tagline: "Creative cards and editorial layout", tone: "dark", accent: "from-fuchsia-400 to-rose-500" },
	{ id: "craft-portfolio", name: "Craft Portfolio", tagline: "Warm, personal, and approachable", tone: "light", accent: "from-amber-400 to-orange-500" },
	{ id: "velocity", name: "Velocity", tagline: "Bold lines for builders and developers", tone: "dark", accent: "from-indigo-400 to-violet-500" },
	{ id: "founder-kit", name: "Founder Kit", tagline: "Startup-ready narrative and CTA", tone: "light", accent: "from-lime-400 to-green-500" },
	{ id: "mono-showcase", name: "Mono Showcase", tagline: "High contrast monochrome elegance", tone: "dark", accent: "from-zinc-400 to-slate-500" },
	{ id: "folio-flow", name: "Folio Flow", tagline: "Fluid sections with guided storytelling", tone: "light", accent: "from-teal-400 to-cyan-500" },
];

const formSteps: FormStep[] = [
	{
		key: "fullName",
		title: "What should we call you on your portfolio?",
		hint: "Use your full name so visitors can remember you quickly.",
		placeholder: "Aitzaz Hakro",
		type: "text",
	},
	{
		key: "role",
		title: "What role or title best describes your work?",
		hint: "Example: Frontend Developer, UI/UX Designer, Data Analyst.",
		placeholder: "Full-Stack Engineer",
		type: "text",
	},
	{
		key: "theme",
		title: "Pick a vibe for your site",
		hint: "Simple words like clean, bold, elegant, playful help shape visuals.",
		placeholder: "Clean and modern",
		type: "text",
	},
	{
		key: "bio",
		title: "Write a short intro",
		hint: "2-3 lines about what you do and what kind of opportunities you want.",
		placeholder: "I build AI-assisted products that are fast, usable, and delightful.",
		type: "textarea",
	},
	{
		key: "skills",
		title: "List your top skills",
		hint: "Separate with commas so we can render skill tags automatically.",
		placeholder: "Next.js, TypeScript, UX Writing, FastAPI",
		type: "textarea",
	},
	{
		key: "primaryProject",
		title: "Tell us about one standout project",
		hint: "Describe what you built and the impact in one sentence.",
		placeholder: "Built a career assistant platform used by 5k+ students.",
		type: "textarea",
	},
	{
		key: "contactEmail",
		title: "Where should people contact you?",
		hint: "Your email appears in the final portfolio contact section.",
		placeholder: "you@example.com",
		type: "email",
	},
	{
		key: "callToAction",
		title: "Final CTA text for your portfolio button",
		hint: "Example: Let’s Work Together, Book a Call, View My Work.",
		placeholder: "Let’s Build Something Great",
		type: "text",
	},
];

const buildTips = [
	"Optimizing section hierarchy for readability...",
	"Balancing color contrast for accessibility...",
	"Polishing mobile spacing and typography rhythm...",
	"Generating preview blocks and interaction cues...",
	"Finalizing export package and deploy metadata...",
];

const initialFormData: PortfolioFormData = {
	fullName: "",
	role: "",
	theme: "",
	bio: "",
	skills: "",
	primaryProject: "",
	contactEmail: "",
	callToAction: "",
};

const fadeWrapper = {
	initial: { opacity: 0, y: 10 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: -10 },
	transition: { duration: 0.35 },
};

const templatePromptDirection: Record<string, string> = {
	"neo-minimal": "Keep the layout minimal, airy, and typography-forward.",
	"product-story": "Organize the content like a product case study with outcomes first.",
	"studio-grid": "Use a creative grid structure with strong visual hierarchy.",
	"craft-portfolio": "Keep the tone warm, human, and approachable.",
	velocity: "Use bold sections and sharp blocks suited for a builder profile.",
	"founder-kit": "Frame the narrative like a startup founder portfolio with clear CTA.",
	"mono-showcase": "Use monochrome contrast and editorial spacing for clarity.",
	"folio-flow": "Use smooth storytelling sections that guide visitors from intro to CTA.",
};

const PORTFOLIO_API_BASE_URL =
	process.env.NEXT_PUBLIC_PORTFOLIO_API_BASE_URL || "https://web-production-57d28a.up.railway.app";
const PORTFOLIO_BUILD_TIMEOUT_MS = 120000;

function toAbsoluteUrl(pathOrUrl: string | undefined, baseUrl: string): string | undefined {
	if (!pathOrUrl) {
		return undefined;
	}

	if (/^https?:\/\//i.test(pathOrUrl)) {
		return pathOrUrl;
	}

	const normalizedBase = baseUrl.replace(/\/$/, "");
	const normalizedPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
	return `${normalizedBase}${normalizedPath}`;
}

function getApiErrorMessage(error: unknown): string {
	if (typeof error === "object" && error !== null) {
		const code = (error as { code?: unknown }).code;
		if (code === "ECONNABORTED") {
			return "Portfolio generation is taking longer than expected. Please retry in a moment.";
		}
	}

	if (typeof error === "object" && error !== null && "response" in error) {
		const response = (error as { response?: { data?: unknown; status?: number } }).response;
		const data = response?.data;

		if (typeof data === "string" && data.trim().length > 0) {
			return data;
		}

		if (typeof data === "object" && data !== null) {
			const detail = (data as { detail?: unknown }).detail;
			if (typeof detail === "string" && detail.trim().length > 0) {
				return detail;
			}

			if (Array.isArray(detail) && detail.length > 0) {
				const firstError = detail[0] as { msg?: string };
				if (firstError?.msg) {
					return firstError.msg;
				}
			}
		}

		if (response?.status) {
			return `Request failed with status ${response.status}.`;
		}
	}

	if (error instanceof Error && error.message.trim().length > 0) {
		return error.message;
	}

	return "Unable to build the portfolio right now. Please try again.";
}

function promptValue(value: string, fallback: string): string {
	const normalized = value.trim();
	return normalized.length > 0 ? normalized : fallback;
}

function buildPortfolioPrompt(data: PortfolioFormData, template: PortfolioTemplate): string {
	const userName = promptValue(data.fullName, "not provided");
	const role = promptValue(data.role, "not provided");
	const intro = promptValue(data.bio, "not provided");
	const topSkills = promptValue(data.skills, "not provided");
	const project = promptValue(data.primaryProject, "not provided");
	const email = promptValue(data.contactEmail, "not provided");
	const cta = promptValue(data.callToAction, "Contact Me");
	const theme = promptValue(data.theme, "clean and modern");
	const templateIntent =
		templatePromptDirection[template.id] ||
		"Keep it clean, readable, and conversion-focused.";

	return [
		`Create portfolio with my name ${userName} and my designation ${role}.`,
		`My short intro is ${intro}.`,
		`My top skills are ${topSkills}.`,
		`My key project is ${project}.`,
		`My email is ${email} and my CTA is ${cta}.`,
		`Use theme preference ${theme}.`,
		`Use template ${template.name}.`,
		templateIntent,
	].join(" ");
}

function getProgress(currentStep: number): number {
	return Math.round(((currentStep + 1) / formSteps.length) * 100);
}

export default function PortfolioBuilderPage() {
	const [stage, setStage] = useState<BuilderStage>("landing");
	const [selectedTemplate, setSelectedTemplate] = useState<PortfolioTemplate>(templates[0]);
	const [stepIndex, setStepIndex] = useState(0);
	const [submitting, setSubmitting] = useState(false);
	const [isBuilding, setIsBuilding] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [tipIndex, setTipIndex] = useState(0);
	const [buildResponse, setBuildResponse] = useState<BuildApiResponse | null>(null);
	const [hasExportedZip, setHasExportedZip] = useState(false);
	const [showDeployGuide, setShowDeployGuide] = useState(false);
	const [formData, setFormData] = useState<PortfolioFormData>(initialFormData);

	const progress = getProgress(stepIndex);
	const currentStep = formSteps[stepIndex];
	const canAdvance = formData[currentStep.key].trim().length > 0;
	const isLastStep = stepIndex === formSteps.length - 1;

	const answeredCount = useMemo(
		() => Object.values(formData).filter((value) => value.trim().length > 0).length,
		[formData],
	);

	const resolvedPreviewUrl = useMemo(() => {
		if (!buildResponse) {
			return undefined;
		}

		const fallbackPath = buildResponse.session_id
			? `/preview/${buildResponse.session_id}`
			: undefined;

		return toAbsoluteUrl(buildResponse.preview_url || fallbackPath, PORTFOLIO_API_BASE_URL);
	}, [buildResponse]);

	const resolvedDownloadUrl = useMemo(() => {
		if (!buildResponse) {
			return undefined;
		}

		const fallbackPath = buildResponse.session_id
			? `/download/${buildResponse.session_id}`
			: undefined;

		return toAbsoluteUrl(
			buildResponse.download_zip || buildResponse.export_url || fallbackPath,
			PORTFOLIO_API_BASE_URL,
		);
	}, [buildResponse]);

	useEffect(() => {
		if (!isBuilding) {
			return;
		}

		const timer = window.setInterval(() => {
			setTipIndex((prev) => (prev + 1) % buildTips.length);
		}, 1800);

		return () => window.clearInterval(timer);
	}, [isBuilding]);

	const moveToBuilder = () => {
		setStage("form");
		setError(null);
	};

	const handleFieldChange = (value: string) => {
		setFormData((prev) => ({
			...prev,
			[currentStep.key]: value,
		}));
	};

	const onNextStep = () => {
		if (!canAdvance) {
			setError("Add an answer or use Skip for this step.");
			return;
		}
		setError(null);
		setStepIndex((prev) => Math.min(prev + 1, formSteps.length - 1));
	};

	const onPreviousStep = () => {
		setError(null);
		setStepIndex((prev) => Math.max(prev - 1, 0));
	};

	const buildPortfolio = async (dataToBuild: PortfolioFormData = formData) => {
		setStage("building");
		setIsBuilding(true);
		setTipIndex(0);
		setSubmitting(true);
		setError(null);
		setHasExportedZip(false);
		setShowDeployGuide(false);
		setBuildResponse(null);

		try {
			const prompt = buildPortfolioPrompt(dataToBuild, selectedTemplate);

			const payload = {
				prompt,
			};

			const endpoint =
				process.env.NEXT_PUBLIC_PORTFOLIO_BUILD_ENDPOINT ||
				`${PORTFOLIO_API_BASE_URL}/generate`;
			const response = await apiClient.post<BuildApiResponse>(endpoint, payload, {
				timeout: PORTFOLIO_BUILD_TIMEOUT_MS,
			});
			const rawData = response.data;
			const baseUrl = (() => {
				try {
					return new URL(endpoint).origin;
				} catch {
					return PORTFOLIO_API_BASE_URL;
				}
			})();
			const normalizedResponse: BuildApiResponse = {
				...rawData,
				preview_url:
					toAbsoluteUrl(
						rawData.preview_url ||
							(rawData.session_id ? `/preview/${rawData.session_id}` : undefined),
						baseUrl,
					),
				download_zip:
					toAbsoluteUrl(
						rawData.download_zip ||
							rawData.export_url ||
							(rawData.session_id ? `/download/${rawData.session_id}` : undefined),
						baseUrl,
					),
				export_url:
					toAbsoluteUrl(
						rawData.export_url ||
							(rawData.session_id ? `/download/${rawData.session_id}` : undefined),
						baseUrl,
					),
			};
			setBuildResponse(normalizedResponse);
		} catch (err: unknown) {
			setError(getApiErrorMessage(err));
		} finally {
			setSubmitting(false);
			setIsBuilding(false);
		}
	};

	const onSkipStep = () => {
		const updatedData: PortfolioFormData = {
			...formData,
			[currentStep.key]: "",
		};
		setFormData(updatedData);
		setError(null);

		if (isLastStep) {
			void buildPortfolio(updatedData);
			return;
		}

		setStepIndex((prev) => Math.min(prev + 1, formSteps.length - 1));
	};

	const exportPortfolio = () => {
		if (resolvedDownloadUrl) {
			window.open(resolvedDownloadUrl, "_blank", "noopener,noreferrer");
			setHasExportedZip(true);
			setError(null);
			return;
		}

		setError("Build portfolio first and wait for the response before exporting.");
	};

	const deployPortfolio = () => {
		setError(null);
		setShowDeployGuide(true);
	};

	const openNetlifyDrop = () => {
		window.open("https://app.netlify.com/drop", "_blank", "noopener,noreferrer");
	};

	return (
		<main className="min-h-screen bg-background text-foreground">
			<div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-emerald-500/15 via-cyan-500/5 to-transparent" />

			<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
				<AnimatePresence mode="wait">
					{stage === "landing" && (
						<motion.section key="landing" {...fadeWrapper} className="space-y-10">
							<section className="rounded-3xl border border-border/70 bg-card/60 p-6 shadow-sm backdrop-blur sm:p-10">
								<div className="mx-auto max-w-3xl text-center">
									<div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-700 dark:text-emerald-300">
										<Sparkles size={14} />
										Portfolio Builder
									</div>
									<h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
										Build a portfolio in one API call
									</h1>
									<p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
										Choose a template, answer quick guided questions, skip any step if needed, and generate a ready-to-share preview.
									</p>

									<div className="mx-auto mt-8 grid max-w-xl gap-3 rounded-2xl border border-border/70 bg-background/80 p-4 text-left sm:grid-cols-3">
										<p className="text-xs text-muted-foreground sm:text-sm">1. Pick template</p>
										<p className="text-xs text-muted-foreground sm:text-sm">2. Answer or skip</p>
										<p className="text-xs text-muted-foreground sm:text-sm">3. Build, preview, export</p>
									</div>

									<button
										onClick={moveToBuilder}
										className="mt-8 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-emerald-500 to-cyan-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02] hover:shadow-cyan-500/25"
									>
										Start
										<ArrowRight size={16} />
									</button>
								</div>
							</section>

							<section>
								<div className="mb-4 flex items-center justify-between">
									<h2 className="text-xl font-semibold sm:text-2xl">Portfolio Templates</h2>
									<p className="text-xs text-muted-foreground sm:text-sm">
										Select one. You can switch anytime before building.
									</p>
								</div>

								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
									{templates.map((template) => {
										const isSelected = selectedTemplate.id === template.id;
										return (
											<button
												key={template.id}
												onClick={() => setSelectedTemplate(template)}
												className={`group rounded-2xl border bg-card p-4 text-left transition ${
													isSelected
														? "border-emerald-500/60 shadow-md shadow-emerald-500/15"
														: "border-border/70 hover:border-emerald-500/30"
												}`}
											>
												<div
													  className={`h-28 rounded-xl bg-linear-to-br ${template.accent} p-px`}
												>
													<div
														className={`h-full rounded-[11px] ${
															template.tone === "dark" ? "bg-zinc-950" : "bg-white"
														}`}
													>
														<div className="flex h-full items-end p-3">
															<div className="h-2 w-20 rounded bg-white/40" />
														</div>
													</div>
												</div>
												<p className="mt-3 text-sm font-medium">{template.name}</p>
												<p className="mt-1 text-xs text-muted-foreground">{template.tagline}</p>
												{isSelected && (
													<p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-300">
														<CheckCircle2 size={14} /> Selected
													</p>
												)}
											</button>
										);
									})}
								</div>
							</section>
						</motion.section>
					)}

					{stage === "form" && (
						<motion.section key="form" {...fadeWrapper} className="mx-auto max-w-3xl">
							<div className="rounded-3xl border border-border/80 bg-card/70 p-5 shadow-sm backdrop-blur sm:p-8">
								<div className="mb-6">
									<div className="mb-2 flex items-center justify-between text-xs text-muted-foreground sm:text-sm">
										<span>
											Step {stepIndex + 1} of {formSteps.length}
										</span>
										<span>
											{progress}% complete | {answeredCount}/{formSteps.length} answered
										</span>
									</div>
									<div className="h-2 w-full overflow-hidden rounded-full bg-muted">
										<motion.div
											className="h-full rounded-full bg-linear-to-r from-emerald-500 to-cyan-500"
											initial={{ width: 0 }}
											animate={{ width: `${progress}%` }}
											transition={{ duration: 0.35 }}
										/>
									</div>
								</div>

								<div className="mb-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-700 dark:text-emerald-300 sm:text-sm">
									Template selected: <span className="font-semibold">{selectedTemplate.name}</span>
								</div>

								<div className="mb-6 rounded-2xl border border-border/70 bg-background/70 p-4 text-xs text-muted-foreground sm:text-sm">
									Any question can be skipped. Skipped fields are still included in the final prompt as "not provided".
								</div>

								<AnimatePresence mode="wait">
									<motion.div
										key={currentStep.key}
										initial={{ opacity: 0, x: 15 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -15 }}
										transition={{ duration: 0.25 }}
									>
										<h2 className="text-xl font-semibold sm:text-2xl">{currentStep.title}</h2>
										<p className="mt-2 text-sm text-muted-foreground">{currentStep.hint}</p>

										{currentStep.type === "textarea" ? (
											<textarea
												value={formData[currentStep.key]}
												onChange={(event) => handleFieldChange(event.target.value)}
												rows={4}
												placeholder={currentStep.placeholder}
												className="mt-5 w-full rounded-2xl border border-border/80 bg-background px-4 py-3 text-sm outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
											/>
										) : (
											<input
												value={formData[currentStep.key]}
												onChange={(event) => handleFieldChange(event.target.value)}
												type={currentStep.type}
												placeholder={currentStep.placeholder}
												className="mt-5 h-12 w-full rounded-2xl border border-border/80 bg-background px-4 text-sm outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
											/>
										)}
									</motion.div>
								</AnimatePresence>

								{error && (
									<p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-300">
										{error}
									</p>
								)}

								<div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
									<div className="flex flex-wrap gap-3">
										<button
											onClick={onPreviousStep}
											disabled={stepIndex === 0 || submitting}
											className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border px-5 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
										>
											<ArrowLeft size={15} /> Back
										</button>

										<button
											onClick={onSkipStep}
											disabled={submitting}
											className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border px-5 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
										>
											Skip Step
										</button>
									</div>

									{isLastStep ? (
										<button
											onClick={() => void buildPortfolio()}
											disabled={submitting}
											className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-linear-to-r from-emerald-500 to-cyan-500 px-6 text-sm font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
										>
											{submitting ? (
												<>
													<Loader2 size={15} className="animate-spin" /> Building...
												</>
											) : (
												<>
													Build Portfolio <WandSparkles size={15} />
												</>
											)}
										</button>
									) : (
										<button
											onClick={onNextStep}
											disabled={!canAdvance || submitting}
											className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-linear-to-r from-emerald-500 to-cyan-500 px-6 text-sm font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
										>
											Next <ArrowRight size={15} />
										</button>
									)}
								</div>
							</div>
						</motion.section>
					)}

					{stage === "building" && (
						<motion.section key="building" {...fadeWrapper}>
							<div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card/70 p-4">
								<div>
									<h2 className="text-lg font-semibold sm:text-xl">Build & Preview</h2>
									<p className="mt-1 text-xs text-muted-foreground sm:text-sm">
										{isBuilding
											? "Building portfolio from one combined prompt..."
											: "Build request finished. You can review, export, or deploy."}
									</p>
								</div>
								<div className="flex flex-wrap items-center gap-2">
									<button
										onClick={exportPortfolio}
										disabled={!resolvedDownloadUrl || isBuilding || submitting}
										className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
									>
										<Download size={15} /> Export File
									</button>
									<button
										onClick={deployPortfolio}
										disabled={!buildResponse || isBuilding || submitting}
										className="inline-flex h-10 items-center gap-2 rounded-full bg-linear-to-r from-cyan-500 to-blue-500 px-4 text-sm font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
									>
										<ExternalLink size={15} /> Deploy Portfolio
									</button>
								</div>
							</div>

							{error && (
								<p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-300">
									{error}
								</p>
							)}

							<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
								<div className="rounded-2xl border border-border/80 bg-card/70 p-5">
									<div className="mb-4 flex items-center gap-2 text-sm font-medium">
										<WandSparkles size={15} className="text-emerald-500" />
										Portfolio Engine
									</div>

									<div className="space-y-3">
										{[0, 1, 2, 3].map((row) => (
											<div
												key={row}
												className="h-16 animate-pulse rounded-xl border border-border/60 bg-muted/60"
											/>
										))}
									</div>

									<div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
										<p className="text-xs uppercase tracking-wide text-emerald-700/80 dark:text-emerald-300/80">
											Live tip
										</p>
										<AnimatePresence mode="wait">
											<motion.p
												key={tipIndex}
												initial={{ opacity: 0, y: 6 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -6 }}
												className="mt-2 text-sm"
											>
												{isBuilding
													? buildTips[tipIndex]
													: "Build complete. Review your preview and export when ready."}
											</motion.p>
										</AnimatePresence>
										{isBuilding && (
											<p className="mt-3 inline-flex items-center gap-2 text-xs text-muted-foreground">
												<Loader2 size={13} className="animate-spin" /> Building in progress
											</p>
										)}
									</div>

									<div className="mt-4 rounded-xl border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
										{isBuilding
											? "Preparing your portfolio preview. This can take a few moments."
											: buildResponse
												? "Build complete. Export the ZIP file before opening deployment instructions."
												: "Fill the form and click Build Portfolio to generate your portfolio."}
									</div>
								</div>

								<div className="rounded-2xl border border-border/80 bg-card/70 p-3 sm:p-4">
									<div className="mb-3 flex items-center gap-2 px-1 text-xs text-muted-foreground">
										<span className="h-2 w-2 rounded-full bg-red-400" />
										<span className="h-2 w-2 rounded-full bg-amber-400" />
										<span className="h-2 w-2 rounded-full bg-emerald-400" />
										<span className="ml-1">Live Preview Window</span>
									</div>

									<div className="h-[440px] overflow-hidden rounded-xl border border-border bg-white shadow-inner sm:h-[560px]">
										{resolvedPreviewUrl ? (
											<iframe
												src={resolvedPreviewUrl}
												title="Portfolio Preview"
												className="h-full w-full"
											/>
										) : buildResponse?.preview_html ? (
											<iframe
												srcDoc={buildResponse.preview_html}
												title="Portfolio Preview"
												className="h-full w-full"
											/>
										) : isBuilding ? (
											<div className="flex h-full flex-col items-center justify-center gap-3 bg-muted/20 p-6 text-center">
												<Loader2 size={24} className="animate-spin text-emerald-500" />
												<p className="text-sm font-medium">Generating live preview...</p>
												<p className="max-w-sm text-xs text-muted-foreground">
													Please wait while the portfolio is being prepared on the server.
												</p>
											</div>
										) : (
											<div className="flex h-full items-center justify-center bg-muted/20 p-6 text-center text-sm text-muted-foreground">
												Preview will appear here after the API response arrives.
											</div>
										)}
									</div>
								</div>
							</div>

							{showDeployGuide && (
								<div className="mt-4 rounded-2xl border border-border/80 bg-card/70 p-5 sm:p-6">
									<h3 className="text-base font-semibold sm:text-lg">Deployment Guide (Netlify Drop)</h3>
									<p className="mt-2 text-sm text-muted-foreground">
										Follow these steps to deploy your generated portfolio quickly.
									</p>
									<div className="mt-4 space-y-2 text-sm text-muted-foreground">
										<p>1. Export your generated portfolio ZIP file to your computer.</p>
										<p>2. Keep the ZIP file ready (no code setup required).</p>
										<p>3. Open Netlify Drop and drag the ZIP to publish instantly.</p>
									</div>
									<div className="mt-5 flex flex-wrap items-center gap-3">
										<button
											onClick={exportPortfolio}
											disabled={!resolvedDownloadUrl}
											className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
										>
											<Download size={15} /> Export ZIP First
										</button>
										{hasExportedZip ? (
											<button
												onClick={openNetlifyDrop}
												className="inline-flex h-10 items-center gap-2 rounded-full bg-linear-to-r from-cyan-500 to-blue-500 px-4 text-sm font-semibold text-white transition hover:scale-[1.02]"
											>
												<ExternalLink size={15} /> Continue To Netlify Drop
											</button>
										) : (
											<p className="text-xs text-muted-foreground">
												Export is required before deployment.
											</p>
										)}
										<button
											onClick={() => setShowDeployGuide(false)}
											className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium transition hover:bg-muted"
										>
											Close
										</button>
									</div>
								</div>
							)}
						</motion.section>
					)}
				</AnimatePresence>
			</div>
		</main>
	);
}
 