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
	Rocket,
	Sparkles,
	WandSparkles,
} from "lucide-react";
import apiClient from "@/lib/apiClient";

type BuilderStage = "landing" | "form" | "submitted" | "building";

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
	preview_url?: string;
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

function getProgress(currentStep: number): number {
	return Math.round(((currentStep + 1) / formSteps.length) * 100);
}

function buildPreviewMarkup(data: PortfolioFormData, template: PortfolioTemplate): string {
	const skills = data.skills
		.split(",")
		.map((skill) => skill.trim())
		.filter(Boolean)
		.slice(0, 8)
		.map(
			(skill) =>
				`<span style="padding:6px 10px;border-radius:999px;background:rgba(255,255,255,.12);font-size:12px;display:inline-block;margin:4px;">${skill}</span>`,
		)
		.join("");

	const surface = template.tone === "dark" ? "#101319" : "#f8fafc";
	const text = template.tone === "dark" ? "#f3f4f6" : "#111827";
	const muted = template.tone === "dark" ? "#9ca3af" : "#4b5563";

	return `
	<!doctype html>
	<html>
		<head>
			<meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<style>
				body { font-family: "Segoe UI", sans-serif; margin: 0; color: ${text}; background: ${surface}; }
				.container { max-width: 840px; margin: 0 auto; padding: 40px 24px; }
				.hero { border: 1px solid rgba(148,163,184,.35); border-radius: 20px; padding: 28px; background: linear-gradient(120deg, rgba(34,197,94,.12), rgba(14,165,233,.14)); }
				h1 { margin: 0; font-size: 34px; line-height: 1.1; }
				h2 { margin: 8px 0 0; font-size: 18px; color: ${muted}; font-weight: 500; }
				p { color: ${muted}; line-height: 1.6; }
				.section { margin-top: 28px; border: 1px solid rgba(148,163,184,.2); border-radius: 16px; padding: 20px; }
				.btn { display: inline-block; margin-top: 16px; padding: 10px 16px; background: #0ea5e9; color: white; border-radius: 999px; text-decoration: none; font-size: 14px; }
			</style>
		</head>
		<body>
			<div class="container">
				<div class="hero">
					<h1>${data.fullName || "Your Name"}</h1>
					<h2>${data.role || "Your Role"}</h2>
					<p>${data.bio || "A concise introduction will appear here."}</p>
					<a class="btn" href="mailto:${data.contactEmail || "you@example.com"}">${data.callToAction || "Contact Me"}</a>
				</div>
				<div class="section">
					<strong>Theme Preference</strong>
					<p>${data.theme || "Clean and modern"}</p>
				</div>
				<div class="section">
					<strong>Featured Project</strong>
					<p>${data.primaryProject || "Project summary appears here."}</p>
				</div>
				<div class="section">
					<strong>Core Skills</strong>
					<div>${skills || "<p>Add a few skills to populate this section.</p>"}</div>
				</div>
			</div>
		</body>
	</html>
	`;
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
	const [formData, setFormData] = useState<PortfolioFormData>(initialFormData);

	const progress = getProgress(stepIndex);
	const currentStep = formSteps[stepIndex];
	const canAdvance = formData[currentStep.key].trim().length > 0;

	const previewMarkup = useMemo(() => {
		if (buildResponse?.preview_html) {
			return buildResponse.preview_html;
		}
		return buildPreviewMarkup(formData, selectedTemplate);
	}, [buildResponse?.preview_html, formData, selectedTemplate]);

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
			return;
		}
		setError(null);
		setStepIndex((prev) => Math.min(prev + 1, formSteps.length - 1));
	};

	const onPreviousStep = () => {
		setError(null);
		setStepIndex((prev) => Math.max(prev - 1, 0));
	};

	const submitDetails = async () => {
		if (!canAdvance) {
			return;
		}

		setSubmitting(true);
		setError(null);

		try {
			const payload = {
				template_id: selectedTemplate.id,
				...formData,
			};

			const endpoint =
				process.env.NEXT_PUBLIC_PORTFOLIO_BUILD_ENDPOINT || "/api/v1/portfolio/build";
			const response = await apiClient.post<BuildApiResponse>(endpoint, payload);
			setBuildResponse(response.data);
			setStage("submitted");
		} catch (err: unknown) {
			const message =
				err instanceof Error ? err.message : "Unable to save details. Please try again.";
			setError(message);
		} finally {
			setSubmitting(false);
		}
	};

	const startBuildNow = async () => {
		setStage("building");
		setIsBuilding(true);
		setTipIndex(0);
		setError(null);

		try {
			const endpoint =
				process.env.NEXT_PUBLIC_PORTFOLIO_BUILD_NOW_ENDPOINT ||
				"/api/v1/portfolio/build-now";
			const response = await apiClient.post<BuildApiResponse>(endpoint, {
				template_id: selectedTemplate.id,
				...formData,
				build_id: buildResponse?.id,
			});
			setBuildResponse((prev) => ({ ...prev, ...response.data }));
		} catch (err: unknown) {
			const message =
				err instanceof Error
					? err.message
					: "Build started locally, but backend status could not be fetched.";
			setError(message);
		} finally {
			window.setTimeout(() => {
				setIsBuilding(false);
			}, 2600);
		}
	};

	const exportPortfolio = () => {
		if (buildResponse?.export_url) {
			window.open(buildResponse.export_url, "_blank", "noopener,noreferrer");
			return;
		}

		const exportData = {
			template: selectedTemplate.id,
			formData,
			generatedAt: new Date().toISOString(),
		};
		const blob = new Blob([JSON.stringify(exportData, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${formData.fullName || "portfolio"}-portfolio.json`;
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	};

	const deployPortfolio = () => {
		if (buildResponse?.deploy_url) {
			window.open(buildResponse.deploy_url, "_blank", "noopener,noreferrer");
			return;
		}
		setError("Deploy endpoint not configured yet. Connect deploy_url from backend response.");
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
										Launch a polished portfolio without touching code
									</h1>
									<p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
										Choose a template, answer one guided question at a time, and generate a ready-to-share portfolio preview.
									</p>

									<div className="mx-auto mt-8 grid max-w-xl gap-3 rounded-2xl border border-border/70 bg-background/80 p-4 text-left sm:grid-cols-3">
										<p className="text-xs text-muted-foreground sm:text-sm">1. Pick template</p>
										<p className="text-xs text-muted-foreground sm:text-sm">2. Fill guided flow</p>
										<p className="text-xs text-muted-foreground sm:text-sm">3. Build and export</p>
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
										Select one. You can switch before submit.
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
										<span>{progress}% complete</span>
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

								<div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-700 dark:text-emerald-300 sm:text-sm">
									Template selected: <span className="font-semibold">{selectedTemplate.name}</span>
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
									<button
										onClick={onPreviousStep}
										disabled={stepIndex === 0}
										className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border px-5 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
									>
										<ArrowLeft size={15} /> Back
									</button>

									{stepIndex === formSteps.length - 1 ? (
										<button
											onClick={submitDetails}
											disabled={!canAdvance || submitting}
											  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-linear-to-r from-emerald-500 to-cyan-500 px-6 text-sm font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
										>
											{submitting ? (
												<>
													<Loader2 size={15} className="animate-spin" /> Submitting...
												</>
											) : (
												<>
													Continue <ArrowRight size={15} />
												</>
											)}
										</button>
									) : (
										<button
											onClick={onNextStep}
											disabled={!canAdvance}
											  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-linear-to-r from-emerald-500 to-cyan-500 px-6 text-sm font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
										>
											Next <ArrowRight size={15} />
										</button>
									)}
								</div>
							</div>
						</motion.section>
					)}

					{stage === "submitted" && (
						<motion.section key="submitted" {...fadeWrapper} className="mx-auto max-w-2xl">
							<div className="rounded-3xl border border-border/80 bg-card/70 p-6 text-center sm:p-10">
								<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
									<CheckCircle2 size={26} />
								</div>
								<h2 className="mt-5 text-2xl font-semibold">Your details are ready</h2>
								<p className="mt-2 text-sm text-muted-foreground sm:text-base">
									Everything is submitted. Start the build process to generate your live portfolio preview.
								</p>

								{error && (
									<p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-300">
										{error}
									</p>
								)}

								<button
									onClick={startBuildNow}
									  className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-linear-to-r from-emerald-500 to-cyan-500 px-8 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02]"
								>
									<Rocket size={16} /> Build Now
								</button>
							</div>
						</motion.section>
					)}

					{stage === "building" && (
						<motion.section key="building" {...fadeWrapper}>
							<div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card/70 p-4">
								<h2 className="text-lg font-semibold sm:text-xl">Build & Preview</h2>
								<div className="flex flex-wrap items-center gap-2">
									<button
										onClick={exportPortfolio}
										className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium transition hover:bg-muted"
									>
										<Download size={15} /> Export File
									</button>
									<button
										onClick={deployPortfolio}
										className="inline-flex h-10 items-center gap-2 rounded-full bg-linear-to-r from-cyan-500 to-blue-500 px-4 text-sm font-semibold text-white transition hover:scale-[1.02]"
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
												{buildTips[tipIndex]}
											</motion.p>
										</AnimatePresence>
										{isBuilding && (
											<p className="mt-3 inline-flex items-center gap-2 text-xs text-muted-foreground">
												<Loader2 size={13} className="animate-spin" /> Building in progress
											</p>
										)}
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
										{buildResponse?.preview_url ? (
											<iframe
												src={buildResponse.preview_url}
												title="Portfolio Preview"
												className="h-full w-full"
											/>
										) : (
											<iframe
												srcDoc={previewMarkup}
												title="Portfolio Preview"
												className="h-full w-full"
											/>
										)}
									</div>
								</div>
							</div>
						</motion.section>
					)}
				</AnimatePresence>
			</div>
		</main>
	);
}
