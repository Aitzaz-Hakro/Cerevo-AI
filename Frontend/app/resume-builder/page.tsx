"use client"

import { useMemo, useReducer } from "react"
import {
	Download,
	Eye,
	EyeOff,
	LayoutTemplate,
	Loader2,
	Plus,
	Sparkles,
	Trash2,
	Wand2,
} from "lucide-react"
import {
	extractResumeKeywords,
	generateResume,
	improveResumeSection,
} from "@/services/resumeBuilder"
import { cn } from "@/lib/utils"

type TemplateId = "classic" | "modern" | "compact"

type PersonalInfo = {
	name: string
	title: string
	email: string
	phone: string
	location: string
	linkedin: string
	portfolio: string
}

type ExperienceItem = {
	role: string
	company: string
	location: string
	startDate: string
	endDate: string
	bullets: string[]
}

type EducationItem = {
	degree: string
	institution: string
	startDate: string
	endDate: string
	details: string
}

type ProjectItem = {
	name: string
	description: string
	technologies: string
	link: string
}

type ResumeDocument = {
	personalInfo: PersonalInfo
	summary: string
	skills: string[]
	experience: ExperienceItem[]
	education: EducationItem[]
	projects: ProjectItem[]
}

type TextAlignMode = "left" | "center" | "right"

type FieldStyle = {
	fontSize: number
	fontWeight: number
	color: string
	align: TextAlignMode
	italic: boolean
	uppercase: boolean
	letterSpacing: number
}

type BuilderState = {
	step: "template" | "editor"
	template: TemplateId
	resume: ResumeDocument
	selectedField: string | null
	fieldStyles: Record<string, FieldStyle>
	previewOnly: boolean
	generating: boolean
	improving: boolean
	extracting: boolean
	keywordSuggestions: string[]
	message: string | null
	error: string | null
}

type BuilderAction =
	| { type: "SELECT_TEMPLATE"; template: TemplateId }
	| { type: "CONTINUE_TO_EDITOR" }
	| { type: "SET_SELECTED_FIELD"; fieldPath: string | null }
	| { type: "UPDATE_FIELD"; fieldPath: string; value: string }
	| { type: "SET_FIELD_STYLE"; fieldPath: string; style: Partial<FieldStyle> }
	| { type: "TOGGLE_PREVIEW" }
	| { type: "SET_GENERATING"; value: boolean }
	| { type: "SET_IMPROVING"; value: boolean }
	| { type: "SET_EXTRACTING"; value: boolean }
	| { type: "SET_MESSAGE"; message: string | null }
	| { type: "SET_ERROR"; error: string | null }
	| { type: "SET_KEYWORDS"; keywords: string[] }
	| { type: "ADD_SKILL"; value: string }
	| { type: "ADD_EXPERIENCE" }
	| { type: "REMOVE_EXPERIENCE"; index: number }
	| { type: "ADD_EDUCATION" }
	| { type: "REMOVE_EDUCATION"; index: number }
	| { type: "ADD_PROJECT" }
	| { type: "REMOVE_PROJECT"; index: number }

const templates: Array<{
	id: TemplateId
	name: string
	description: string
	accentClass: string
}> = [
	{
		id: "classic",
		name: "Classic",
		description: "Simple and ATS-friendly. Best for most roles.",
		accentClass: "from-teal-400/20 to-blue-500/20",
	},
	{
		id: "modern",
		name: "Modern",
		description: "Balanced hierarchy with a bolder visual rhythm.",
		accentClass: "from-cyan-400/20 to-indigo-500/20",
	},
	{
		id: "compact",
		name: "Compact",
		description: "Dense layout optimized for one-page resumes.",
		accentClass: "from-emerald-400/20 to-sky-500/20",
	},
]

const defaultFieldStyle: FieldStyle = {
	fontSize: 14,
	fontWeight: 400,
	color: "#0f172a",
	align: "left",
	italic: false,
	uppercase: false,
	letterSpacing: 0,
}

const initialResume: ResumeDocument = {
	personalInfo: {
		name: "Your Name",
		title: "Product Designer",
		email: "you@email.com",
		phone: "+1 (000) 000-0000",
		location: "San Francisco, CA",
		linkedin: "linkedin.com/in/yourprofile",
		portfolio: "yourportfolio.com",
	},
	summary:
		"Results-driven professional with a track record of delivering user-centered products, cross-functional collaboration, and measurable business impact.",
	skills: ["Product Strategy", "Figma", "Design Systems", "User Research", "React"],
	experience: [
		{
			role: "Senior Product Designer",
			company: "Northstar Labs",
			location: "Remote",
			startDate: "2022",
			endDate: "Present",
			bullets: [
				"Redesigned onboarding funnel and improved activation by 28%.",
				"Led design system rollout across 5 product teams.",
			],
		},
	],
	education: [
		{
			degree: "B.S. in Computer Science",
			institution: "State University",
			startDate: "2015",
			endDate: "2019",
			details: "Graduated with honors.",
		},
	],
	projects: [
		{
			name: "Growth Analytics Dashboard",
			description: "Built a real-time dashboard used by marketing and product teams.",
			technologies: "React, TypeScript, D3",
			link: "github.com/yourprofile/growth-dashboard",
		},
	],
}

const initialState: BuilderState = {
	step: "template",
	template: "classic",
	resume: initialResume,
	selectedField: "personalInfo.name",
	fieldStyles: {},
	previewOnly: false,
	generating: false,
	improving: false,
	extracting: false,
	keywordSuggestions: [],
	message: null,
	error: null,
}

function isNumericSegment(value: string) {
	return /^\d+$/.test(value)
}

function getNestedValue(source: unknown, fieldPath: string): unknown {
	const segments = fieldPath.split(".")
	let cursor: any = source

	for (const segment of segments) {
		if (cursor === null || cursor === undefined) return undefined
		const key = isNumericSegment(segment) ? Number(segment) : segment
		cursor = cursor[key]
	}

	return cursor
}

function setNestedValue(source: unknown, fieldPath: string, value: string): unknown {
	const segments = fieldPath.split(".")
	const root = Array.isArray(source) ? [...source] : { ...(source as Record<string, unknown>) }
	let cursor: any = root

	for (let index = 0; index < segments.length; index += 1) {
		const segment = segments[index]
		const key = isNumericSegment(segment) ? Number(segment) : segment

		if (index === segments.length - 1) {
			cursor[key] = value
			break
		}

		const nextSegment = segments[index + 1]
		const nextIsArray = isNumericSegment(nextSegment)
		const current = cursor[key]

		if (Array.isArray(current)) {
			cursor[key] = [...current]
		} else if (current && typeof current === "object") {
			cursor[key] = { ...current }
		} else {
			cursor[key] = nextIsArray ? [] : {}
		}

		cursor = cursor[key]
	}

	return root
}

function resolveStyle(style?: FieldStyle): FieldStyle {
	return {
		...defaultFieldStyle,
		...(style || {}),
	}
}

function toApiPayload(resume: ResumeDocument, template: TemplateId) {
	return {
		personal_info: {
			name: resume.personalInfo.name,
			title: resume.personalInfo.title,
			email: resume.personalInfo.email,
			phone: resume.personalInfo.phone,
			location: resume.personalInfo.location,
			linkedin: resume.personalInfo.linkedin,
			portfolio: resume.personalInfo.portfolio,
		},
		summary: resume.summary,
		skills: resume.skills.filter((skill) => skill.trim().length > 0),
		experience: resume.experience.map((item) => ({
			title: item.role,
			company: item.company,
			location: item.location,
			duration: `${item.startDate} - ${item.endDate}`,
			description: item.bullets.filter((bullet) => bullet.trim().length > 0).join(" "),
		})),
		education: resume.education.map((item) => ({
			degree: item.degree,
			institution: item.institution,
			year: `${item.startDate} - ${item.endDate}`,
			details: item.details,
		})),
		projects: resume.projects.map((item) => ({
			name: item.name,
			description: item.description,
			technologies: item.technologies
				.split(",")
				.map((value) => value.trim())
				.filter(Boolean),
			link: item.link,
		})),
		template,
	}
}

function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
	switch (action.type) {
		case "SELECT_TEMPLATE":
			return {
				...state,
				template: action.template,
				message: null,
				error: null,
			}

		case "CONTINUE_TO_EDITOR":
			return {
				...state,
				step: "editor",
				message: null,
				error: null,
			}

		case "SET_SELECTED_FIELD":
			return {
				...state,
				selectedField: action.fieldPath,
			}

		case "UPDATE_FIELD":
			return {
				...state,
				resume: setNestedValue(state.resume, action.fieldPath, action.value) as ResumeDocument,
			}

		case "SET_FIELD_STYLE":
			return {
				...state,
				fieldStyles: {
					...state.fieldStyles,
					[action.fieldPath]: {
						...resolveStyle(state.fieldStyles[action.fieldPath]),
						...action.style,
					},
				},
			}

		case "TOGGLE_PREVIEW":
			return {
				...state,
				previewOnly: !state.previewOnly,
			}

		case "SET_GENERATING":
			return {
				...state,
				generating: action.value,
			}

		case "SET_IMPROVING":
			return {
				...state,
				improving: action.value,
			}

		case "SET_EXTRACTING":
			return {
				...state,
				extracting: action.value,
			}

		case "SET_MESSAGE":
			return {
				...state,
				message: action.message,
			}

		case "SET_ERROR":
			return {
				...state,
				error: action.error,
			}

		case "SET_KEYWORDS":
			return {
				...state,
				keywordSuggestions: action.keywords,
			}

		case "ADD_SKILL": {
			const newSkill = action.value.trim()
			if (!newSkill) return state
			if (state.resume.skills.includes(newSkill)) return state

			return {
				...state,
				resume: {
					...state.resume,
					skills: [...state.resume.skills, newSkill],
				},
			}
		}

		case "ADD_EXPERIENCE":
			return {
				...state,
				resume: {
					...state.resume,
					experience: [
						...state.resume.experience,
						{
							role: "Role Title",
							company: "Company",
							location: "City",
							startDate: "2024",
							endDate: "Present",
							bullets: ["Describe your impact in one clear bullet."],
						},
					],
				},
			}

		case "REMOVE_EXPERIENCE":
			return {
				...state,
				resume: {
					...state.resume,
					experience: state.resume.experience.filter((_, index) => index !== action.index),
				},
			}

		case "ADD_EDUCATION":
			return {
				...state,
				resume: {
					...state.resume,
					education: [
						...state.resume.education,
						{
							degree: "Degree",
							institution: "Institution",
							startDate: "2018",
							endDate: "2022",
							details: "Add key coursework or honors.",
						},
					],
				},
			}

		case "REMOVE_EDUCATION":
			return {
				...state,
				resume: {
					...state.resume,
					education: state.resume.education.filter((_, index) => index !== action.index),
				},
			}

		case "ADD_PROJECT":
			return {
				...state,
				resume: {
					...state.resume,
					projects: [
						...state.resume.projects,
						{
							name: "Project Name",
							description: "Describe what you built and outcomes.",
							technologies: "Tech Stack",
							link: "project-link.com",
						},
					],
				},
			}

		case "REMOVE_PROJECT":
			return {
				...state,
				resume: {
					...state.resume,
					projects: state.resume.projects.filter((_, index) => index !== action.index),
				},
			}

		default:
			return state
	}
}

function sectionClassByTemplate(template: TemplateId) {
	if (template === "modern") return "tracking-[0.16em] text-cyan-700"
	if (template === "compact") return "tracking-[0.2em] text-sky-700"
	return "tracking-[0.14em] text-teal-700"
}

function fontClassByTemplate(template: TemplateId) {
	if (template === "modern") return "font-sans"
	if (template === "compact") return "font-sans"
	return "font-serif"
}

export default function ResumeBuilderPage() {
	const [state, dispatch] = useReducer(builderReducer, initialState)

	const selectedValue = useMemo(() => {
		if (!state.selectedField) return ""
		const value = getNestedValue(state.resume, state.selectedField)
		return typeof value === "string" ? value : ""
	}, [state.resume, state.selectedField])

	const selectedStyle = useMemo(() => {
		if (!state.selectedField) return resolveStyle()
		return resolveStyle(state.fieldStyles[state.selectedField])
	}, [state.selectedField, state.fieldStyles])

	const onGenerateResume = async () => {
		dispatch({ type: "SET_ERROR", error: null })
		dispatch({ type: "SET_MESSAGE", message: null })
		dispatch({ type: "SET_GENERATING", value: true })

		try {
			const payload = toApiPayload(state.resume, state.template)
			const fileName = `${state.resume.personalInfo.name || "Resume"}`.replace(/\s+/g, "_") + "_AI_Resume.pdf"
			const result = await generateResume(payload, {
				autoDownload: true,
				fileName,
			})

			if (!result?.blob && result?.fileURL && !String(result.fileURL).startsWith("blob:")) {
				window.open(String(result.fileURL), "_blank", "noopener,noreferrer")
			}

			dispatch({ type: "SET_MESSAGE", message: "Resume generated successfully." })
		} catch (error: any) {
			dispatch({
				type: "SET_ERROR",
				error: error?.message || "Failed to generate resume.",
			})
		} finally {
			dispatch({ type: "SET_GENERATING", value: false })
		}
	}

	const onImproveSelectedField = async () => {
		if (!state.selectedField) {
			dispatch({ type: "SET_ERROR", error: "Select a field in the resume first." })
			return
		}

		const currentValue = getNestedValue(state.resume, state.selectedField)
		if (typeof currentValue !== "string" || !currentValue.trim()) {
			dispatch({ type: "SET_ERROR", error: "Selected field has no editable text." })
			return
		}

		dispatch({ type: "SET_ERROR", error: null })
		dispatch({ type: "SET_IMPROVING", value: true })

		try {
			const section = state.selectedField.split(".")[0]
			const result = await improveResumeSection({
				section,
				content: currentValue,
				template: state.template,
				context: toApiPayload(state.resume, state.template),
			})

			const improvedText = String(result?.improvedText || "").trim()
			if (!improvedText) {
				throw new Error("The AI did not return improved content for this field.")
			}

			dispatch({
				type: "UPDATE_FIELD",
				fieldPath: state.selectedField,
				value: improvedText,
			})
			dispatch({
				type: "SET_MESSAGE",
				message: "Selected field was improved with AI.",
			})
		} catch (error: any) {
			dispatch({
				type: "SET_ERROR",
				error: error?.message || "Failed to improve the selected section.",
			})
		} finally {
			dispatch({ type: "SET_IMPROVING", value: false })
		}
	}

	const onExtractKeywords = async () => {
		dispatch({ type: "SET_ERROR", error: null })
		dispatch({ type: "SET_EXTRACTING", value: true })

		try {
			const sourceText = [
				state.resume.summary,
				...state.resume.skills,
				...state.resume.experience.flatMap((item) => item.bullets),
			]
				.join("\n")
				.trim()

			const result = await extractResumeKeywords({ text: sourceText })
			dispatch({ type: "SET_KEYWORDS", keywords: result.keywords || [] })

			dispatch({
				type: "SET_MESSAGE",
				message: "Keyword suggestions are ready.",
			})
		} catch (error: any) {
			dispatch({
				type: "SET_ERROR",
				error: error?.message || "Failed to extract keywords.",
			})
		} finally {
			dispatch({ type: "SET_EXTRACTING", value: false })
		}
	}

	return (
		<main className="min-h-screen bg-linear-to-b from-background via-background to-muted/30 px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
			<section className="max-w-[1400px] mx-auto space-y-6">
				<div className="rounded-2xl border border-border/70 bg-card/80 backdrop-blur-sm p-6 sm:p-8">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
								Resume Builder Studio
							</h1>
							<p className="text-muted-foreground mt-2 max-w-2xl">
								Choose a template, edit any field directly on the resume canvas, refine with AI,
								and export a production-ready resume.
							</p>
						</div>

						<div className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm">
							<LayoutTemplate size={16} className="text-primary" />
							{state.template.charAt(0).toUpperCase() + state.template.slice(1)} template
						</div>
					</div>
				</div>

				{state.step === "template" ? (
					<section className="rounded-2xl border border-border/70 bg-card p-5 sm:p-8 space-y-6">
						<div>
							<h2 className="text-xl sm:text-2xl font-semibold">Select Your Template</h2>
							<p className="text-sm text-muted-foreground mt-1">
								Classic is selected by default. Continue to start editing your resume.
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{templates.map((template) => {
								const selected = state.template === template.id
								return (
									<button
										key={template.id}
										type="button"
										onClick={() => dispatch({ type: "SELECT_TEMPLATE", template: template.id })}
										className={cn(
											"text-left rounded-2xl border p-5 transition-all",
											selected
												? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
												: "border-border/70 bg-background hover:border-primary/40 hover:-translate-y-0.5",
										)}
									>
										<div className={cn("h-28 rounded-xl border border-border/50 bg-linear-to-br", template.accentClass)} />
										<h3 className="font-semibold text-lg mt-4">{template.name}</h3>
										<p className="text-sm text-muted-foreground mt-1">{template.description}</p>
										{selected && (
											<span className="inline-flex mt-3 text-xs font-medium rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-primary">
												Selected
											</span>
										)}
									</button>
								)
							})}
						</div>

						<button
							type="button"
							onClick={() => dispatch({ type: "CONTINUE_TO_EDITOR" })}
							className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-linear-to-r from-teal-400 to-blue-500 text-white font-semibold hover:shadow-lg transition"
						>
							Continue With Template
						</button>
					</section>
				) : (
					<section className="space-y-4">
						<div className="flex items-center justify-end gap-2">
							<button
								type="button"
								onClick={() => dispatch({ type: "TOGGLE_PREVIEW" })}
								className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted transition"
							>
								{state.previewOnly ? <EyeOff size={16} /> : <Eye size={16} />}
								{state.previewOnly ? "Exit View" : "View"}
							</button>

							<button
								type="button"
								onClick={onGenerateResume}
								disabled={state.generating}
								className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-teal-400 to-blue-500 px-4 py-2 text-sm font-semibold text-white hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
							>
								{state.generating ? (
									<Loader2 size={16} className="animate-spin" />
								) : (
									<Download size={16} />
								)}
								{state.generating ? "Generating..." : "Download"}
							</button>
						</div>

						<div
							className={cn(
								"grid gap-4 items-start",
								state.previewOnly ? "grid-cols-1" : "grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)_320px]",
							)}
						>
							{!state.previewOnly && (
								<aside className="rounded-2xl border border-border/70 bg-card p-4 space-y-4 xl:sticky xl:top-24">
									<div>
										<h3 className="font-semibold">Sections</h3>
										<p className="text-xs text-muted-foreground mt-1">Add and manage resume blocks.</p>
									</div>

									<div className="space-y-2">
										<button
											type="button"
											onClick={() => dispatch({ type: "ADD_EXPERIENCE" })}
											className="w-full inline-flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm hover:bg-muted transition"
										>
											Add Experience
											<Plus size={14} />
										</button>

										<button
											type="button"
											onClick={() => dispatch({ type: "ADD_EDUCATION" })}
											className="w-full inline-flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm hover:bg-muted transition"
										>
											Add Education
											<Plus size={14} />
										</button>

										<button
											type="button"
											onClick={() => dispatch({ type: "ADD_PROJECT" })}
											className="w-full inline-flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm hover:bg-muted transition"
										>
											Add Project
											<Plus size={14} />
										</button>
									</div>

									<div className="pt-2 border-t border-border/70">
										<h4 className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Quick Select</h4>
										<div className="space-y-2">
											{["personalInfo.name", "summary", "skills.0"].map((path) => (
												<button
													key={path}
													type="button"
													onClick={() => dispatch({ type: "SET_SELECTED_FIELD", fieldPath: path })}
													className={cn(
														"w-full text-left rounded-md px-2 py-1.5 text-xs transition",
														state.selectedField === path
															? "bg-primary/15 text-primary"
															: "hover:bg-muted",
													)}
												>
													{path}
												</button>
											))}
										</div>
									</div>
								</aside>
							)}

							<div className="rounded-2xl border border-border/70 bg-muted/30 p-3 sm:p-5">
								<article
									className={cn(
										"mx-auto min-h-[1080px] max-w-[860px] bg-white p-6 sm:p-10 shadow-xl shadow-slate-900/10",
										fontClassByTemplate(state.template),
										state.template === "compact" ? "space-y-5" : "space-y-7",
									)}
								>
									<header className="space-y-2 border-b border-slate-200 pb-4">
										<EditableText
											className="text-3xl sm:text-4xl font-semibold text-slate-900"
											fieldPath="personalInfo.name"
											selectedField={state.selectedField}
											styleConfig={state.fieldStyles["personalInfo.name"]}
											value={state.resume.personalInfo.name}
											onSelect={(fieldPath) => dispatch({ type: "SET_SELECTED_FIELD", fieldPath })}
										/>

										<EditableText
											className="text-base font-medium text-slate-700"
											fieldPath="personalInfo.title"
											selectedField={state.selectedField}
											styleConfig={state.fieldStyles["personalInfo.title"]}
											value={state.resume.personalInfo.title}
											onSelect={(fieldPath) => dispatch({ type: "SET_SELECTED_FIELD", fieldPath })}
										/>

										<div className="grid gap-1 sm:grid-cols-2 text-sm text-slate-600">
											<EditableText
												className="text-sm"
												fieldPath="personalInfo.email"
												selectedField={state.selectedField}
												styleConfig={state.fieldStyles["personalInfo.email"]}
												value={state.resume.personalInfo.email}
												onSelect={(fieldPath) => dispatch({ type: "SET_SELECTED_FIELD", fieldPath })}
											/>
											<EditableText
												className="text-sm"
												fieldPath="personalInfo.phone"
												selectedField={state.selectedField}
												styleConfig={state.fieldStyles["personalInfo.phone"]}
												value={state.resume.personalInfo.phone}
												onSelect={(fieldPath) => dispatch({ type: "SET_SELECTED_FIELD", fieldPath })}
											/>
											<EditableText
												className="text-sm"
												fieldPath="personalInfo.location"
												selectedField={state.selectedField}
												styleConfig={state.fieldStyles["personalInfo.location"]}
												value={state.resume.personalInfo.location}
												onSelect={(fieldPath) => dispatch({ type: "SET_SELECTED_FIELD", fieldPath })}
											/>
											<EditableText
												className="text-sm"
												fieldPath="personalInfo.linkedin"
												selectedField={state.selectedField}
												styleConfig={state.fieldStyles["personalInfo.linkedin"]}
												value={state.resume.personalInfo.linkedin}
												onSelect={(fieldPath) => dispatch({ type: "SET_SELECTED_FIELD", fieldPath })}
											/>
										</div>
									</header>

									<ResumeSection title="Profile" template={state.template}>
										<EditableText
											className="text-[15px] leading-7 text-slate-700"
											fieldPath="summary"
											selectedField={state.selectedField}
											styleConfig={state.fieldStyles.summary}
											value={state.resume.summary}
											onSelect={(fieldPath) => dispatch({ type: "SET_SELECTED_FIELD", fieldPath })}
										/>
									</ResumeSection>

									<ResumeSection title="Skills" template={state.template}>
										<div className="flex flex-wrap gap-2">
											{state.resume.skills.map((skill, index) => (
												<EditableText
													key={`skill-${index}`}
													className="inline-flex rounded-full border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
													fieldPath={`skills.${index}`}
													selectedField={state.selectedField}
													styleConfig={state.fieldStyles[`skills.${index}`]}
													value={skill}
													onSelect={(fieldPath) => dispatch({ type: "SET_SELECTED_FIELD", fieldPath })}
												/>
											))}
										</div>
									</ResumeSection>

									<ResumeSection title="Experience" template={state.template}>
										<div className="space-y-5">
											{state.resume.experience.map((item, itemIndex) => (
												<div key={`experience-${itemIndex}`} className="rounded-lg border border-slate-200 p-3">
													<div className="flex items-start justify-between gap-3">
														<div className="space-y-1 flex-1">
															<EditableText
																className="text-[15px] font-semibold text-slate-900"
																fieldPath={`experience.${itemIndex}.role`}
																selectedField={state.selectedField}
																styleConfig={state.fieldStyles[`experience.${itemIndex}.role`]}
																value={item.role}
																onSelect={(fieldPath) => dispatch({ type: "SET_SELECTED_FIELD", fieldPath })}
															/>
															<EditableText
																className="text-sm text-slate-700"
																fieldPath={`experience.${itemIndex}.company`}
																selectedField={state.selectedField}
																styleConfig={state.fieldStyles[`experience.${itemIndex}.company`]}
																value={item.company}
																onSelect={(fieldPath) => dispatch({ type: "SET_SELECTED_FIELD", fieldPath })}
															/>
														</div>

														<button
															type="button"
															onClick={() => dispatch({ type: "REMOVE_EXPERIENCE", index: itemIndex })}
															className="inline-flex items-center justify-center rounded-md border border-slate-300 p-1.5 text-slate-500 hover:text-red-500 hover:border-red-300 transition"
														>
															<Trash2 size={14} />
														</button>
													</div>

													<div className="mt-1 flex flex-wrap gap-x-2 text-xs text-slate-500">
														<EditableText
															className="text-xs"
															fieldPath={`experience.${itemIndex}.location`}
															selectedField={state.selectedField}
															styleConfig={state.fieldStyles[`experience.${itemIndex}.location`]}
															value={item.location}
															onSelect={(fieldPath) => dispatch({ type: "SET_SELECTED_FIELD", fieldPath })}
														/>
														<span>-</span>
														<EditableText
															className="text-xs"
															fieldPath={`experience.${itemIndex}.startDate`}
															selectedField={state.selectedField}
															styleConfig={state.fieldStyles[`experience.${itemIndex}.startDate`]}
															value={item.startDate}
															onSelect={(fieldPath) => dispatch({ type: "SET_SELECTED_FIELD", fieldPath })}
														/>
														<span>to</span>
														<EditableText
															className="text-xs"
															fieldPath={`experience.${itemIndex}.endDate`}
															selectedField={state.selectedField}
															styleConfig={state.fieldStyles[`experience.${itemIndex}.endDate`]}
															value={item.endDate}
															onSelect={(fieldPath) => dispatch({ type: "SET_SELECTED_FIELD", fieldPath })}
														/>
													</div>

													<ul className="mt-2 space-y-1">
														{item.bullets.map((bullet, bulletIndex) => (
															<li key={`exp-${itemIndex}-bullet-${bulletIndex}`} className="list-disc ml-4 text-sm text-slate-700">
																<EditableText
																	className="text-sm"
																	fieldPath={`experience.${itemIndex}.bullets.${bulletIndex}`}
																	selectedField={state.selectedField}
																	styleConfig={state.fieldStyles[`experience.${itemIndex}.bullets.${bulletIndex}`]}
																	value={bullet}
																	onSelect={(fieldPath) => dispatch({ type: "SET_SELECTED_FIELD", fieldPath })}
																/>
															</li>
														))}
													</ul>
												</div>
											))}
										</div>
									</ResumeSection>

									<ResumeSection title="Education" template={state.template}>
										<div className="space-y-4">
											{state.resume.education.map((item, itemIndex) => (
												<div key={`education-${itemIndex}`} className="rounded-lg border border-slate-200 p-3">
													<div className="flex items-start justify-between gap-3">
														<div className="space-y-1 flex-1">
															<EditableText
																className="text-[15px] font-semibold text-slate-900"
																fieldPath={`education.${itemIndex}.degree`}
																selectedField={state.selectedField}
																styleConfig={state.fieldStyles[`education.${itemIndex}.degree`]}
																value={item.degree}
																onSelect={(fieldPath) => dispatch({ type: "SET_SELECTED_FIELD", fieldPath })}
															/>
															<EditableText
																className="text-sm text-slate-700"
																fieldPath={`education.${itemIndex}.institution`}
																selectedField={state.selectedField}
																styleConfig={state.fieldStyles[`education.${itemIndex}.institution`]}
																value={item.institution}
																onSelect={(fieldPath) => dispatch({ type: "SET_SELECTED_FIELD", fieldPath })}
															/>
														</div>
														<button
															type="button"
															onClick={() => dispatch({ type: "REMOVE_EDUCATION", index: itemIndex })}
															className="inline-flex items-center justify-center rounded-md border border-slate-300 p-1.5 text-slate-500 hover:text-red-500 hover:border-red-300 transition"
														>
															<Trash2 size={14} />
														</button>
													</div>

													<div className="mt-1 flex flex-wrap gap-x-2 text-xs text-slate-500">
														<EditableText
															className="text-xs"
															fieldPath={`education.${itemIndex}.startDate`}
															selectedField={state.selectedField}
															styleConfig={state.fieldStyles[`education.${itemIndex}.startDate`]}
															value={item.startDate}
															onSelect={(fieldPath) => dispatch({ type: "SET_SELECTED_FIELD", fieldPath })}
														/>
														<span>to</span>
														<EditableText
															className="text-xs"
															fieldPath={`education.${itemIndex}.endDate`}
															selectedField={state.selectedField}
															styleConfig={state.fieldStyles[`education.${itemIndex}.endDate`]}
															value={item.endDate}
															onSelect={(fieldPath) => dispatch({ type: "SET_SELECTED_FIELD", fieldPath })}
														/>
													</div>

													<EditableText
														className="mt-2 text-sm text-slate-700"
														fieldPath={`education.${itemIndex}.details`}
														selectedField={state.selectedField}
														styleConfig={state.fieldStyles[`education.${itemIndex}.details`]}
														value={item.details}
														onSelect={(fieldPath) => dispatch({ type: "SET_SELECTED_FIELD", fieldPath })}
													/>
												</div>
											))}
										</div>
									</ResumeSection>

									<ResumeSection title="Projects" template={state.template}>
										<div className="space-y-4">
											{state.resume.projects.map((item, itemIndex) => (
												<div key={`project-${itemIndex}`} className="rounded-lg border border-slate-200 p-3">
													<div className="flex items-start justify-between gap-3">
														<EditableText
															className="text-[15px] font-semibold text-slate-900"
															fieldPath={`projects.${itemIndex}.name`}
															selectedField={state.selectedField}
															styleConfig={state.fieldStyles[`projects.${itemIndex}.name`]}
															value={item.name}
															onSelect={(fieldPath) => dispatch({ type: "SET_SELECTED_FIELD", fieldPath })}
														/>

														<button
															type="button"
															onClick={() => dispatch({ type: "REMOVE_PROJECT", index: itemIndex })}
															className="inline-flex items-center justify-center rounded-md border border-slate-300 p-1.5 text-slate-500 hover:text-red-500 hover:border-red-300 transition"
														>
															<Trash2 size={14} />
														</button>
													</div>

													<EditableText
														className="mt-2 text-sm text-slate-700"
														fieldPath={`projects.${itemIndex}.description`}
														selectedField={state.selectedField}
														styleConfig={state.fieldStyles[`projects.${itemIndex}.description`]}
														value={item.description}
														onSelect={(fieldPath) => dispatch({ type: "SET_SELECTED_FIELD", fieldPath })}
													/>

													<div className="mt-2 text-xs text-slate-600">
														<span className="font-medium">Tech: </span>
														<EditableText
															className="text-xs"
															fieldPath={`projects.${itemIndex}.technologies`}
															selectedField={state.selectedField}
															styleConfig={state.fieldStyles[`projects.${itemIndex}.technologies`]}
															value={item.technologies}
															onSelect={(fieldPath) => dispatch({ type: "SET_SELECTED_FIELD", fieldPath })}
														/>
													</div>

													<EditableText
														className="mt-1 text-xs text-blue-700"
														fieldPath={`projects.${itemIndex}.link`}
														selectedField={state.selectedField}
														styleConfig={state.fieldStyles[`projects.${itemIndex}.link`]}
														value={item.link}
														onSelect={(fieldPath) => dispatch({ type: "SET_SELECTED_FIELD", fieldPath })}
													/>
												</div>
											))}
										</div>
									</ResumeSection>
								</article>
							</div>

							{!state.previewOnly && (
								<aside className="rounded-2xl border border-border/70 bg-card p-4 space-y-4 xl:sticky xl:top-24">
									<div>
										<h3 className="font-semibold">Edit Resume</h3>
										<p className="text-xs text-muted-foreground mt-1">
											Click any field in the resume to edit content and style.
										</p>
									</div>

									{state.selectedField ? (
										<>
											<label className="block space-y-2">
												<span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
													Selected Field
												</span>
												<input
													value={state.selectedField}
													readOnly
													className="w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs"
												/>
											</label>

											<label className="block space-y-2">
												<span className="text-sm font-medium">Content</span>
												<textarea
													value={selectedValue}
													rows={6}
													onChange={(event) =>
														dispatch({
															type: "UPDATE_FIELD",
															fieldPath: state.selectedField,
															value: event.target.value,
														})
													}
													className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
												/>
											</label>

											<div className="grid grid-cols-2 gap-3">
												<label className="space-y-1">
													<span className="text-xs text-muted-foreground">Font Size</span>
													<input
														type="number"
														min={10}
														max={40}
														value={selectedStyle.fontSize}
														onChange={(event) =>
															dispatch({
																type: "SET_FIELD_STYLE",
																fieldPath: state.selectedField,
																style: { fontSize: Number(event.target.value || 14) },
															})
														}
														className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
													/>
												</label>

												<label className="space-y-1">
													<span className="text-xs text-muted-foreground">Weight</span>
													<select
														value={selectedStyle.fontWeight}
														onChange={(event) =>
															dispatch({
																type: "SET_FIELD_STYLE",
																fieldPath: state.selectedField,
																style: { fontWeight: Number(event.target.value) },
															})
														}
														className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
													>
														<option value={400}>400</option>
														<option value={500}>500</option>
														<option value={600}>600</option>
														<option value={700}>700</option>
													</select>
												</label>

												<label className="space-y-1">
													<span className="text-xs text-muted-foreground">Color</span>
													<input
														type="color"
														value={selectedStyle.color}
														onChange={(event) =>
															dispatch({
																type: "SET_FIELD_STYLE",
																fieldPath: state.selectedField,
																style: { color: event.target.value },
															})
														}
														className="h-9 w-full rounded-lg border border-border bg-background px-1"
													/>
												</label>

												<label className="space-y-1">
													<span className="text-xs text-muted-foreground">Align</span>
													<select
														value={selectedStyle.align}
														onChange={(event) =>
															dispatch({
																type: "SET_FIELD_STYLE",
																fieldPath: state.selectedField,
																style: { align: event.target.value as TextAlignMode },
															})
														}
														className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
													>
														<option value="left">Left</option>
														<option value="center">Center</option>
														<option value="right">Right</option>
													</select>
												</label>
											</div>

											<div className="grid grid-cols-2 gap-2">
												<button
													type="button"
													onClick={() =>
														dispatch({
															type: "SET_FIELD_STYLE",
															fieldPath: state.selectedField,
															style: { italic: !selectedStyle.italic },
														})
													}
													className={cn(
														"rounded-lg border px-3 py-2 text-sm transition",
														selectedStyle.italic
															? "border-primary bg-primary/10 text-primary"
															: "border-border hover:bg-muted",
													)}
												>
													Italic
												</button>
												<button
													type="button"
													onClick={() =>
														dispatch({
															type: "SET_FIELD_STYLE",
															fieldPath: state.selectedField,
															style: { uppercase: !selectedStyle.uppercase },
														})
													}
													className={cn(
														"rounded-lg border px-3 py-2 text-sm transition",
														selectedStyle.uppercase
															? "border-primary bg-primary/10 text-primary"
															: "border-border hover:bg-muted",
													)}
												>
													Uppercase
												</button>
											</div>

											<button
												type="button"
												onClick={onImproveSelectedField}
												disabled={state.improving}
												className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-medium hover:bg-muted transition disabled:opacity-60"
											>
												{state.improving ? (
													<Loader2 size={14} className="animate-spin" />
												) : (
													<Wand2 size={14} />
												)}
												Improve Selected Section
											</button>
										</>
									) : (
										<p className="text-sm text-muted-foreground">
											Click any text block on the resume to unlock editing controls.
										</p>
									)}

									<div className="pt-3 border-t border-border/70 space-y-3">
										<button
											type="button"
											onClick={onExtractKeywords}
											disabled={state.extracting}
											className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-medium hover:bg-muted transition disabled:opacity-60"
										>
											{state.extracting ? (
												<Loader2 size={14} className="animate-spin" />
											) : (
												<Sparkles size={14} />
											)}
											Extract Keyword Suggestions
										</button>

										{state.keywordSuggestions.length > 0 && (
											<div className="flex flex-wrap gap-2">
												{state.keywordSuggestions.map((keyword) => (
													<button
														key={keyword}
														type="button"
														onClick={() => dispatch({ type: "ADD_SKILL", value: keyword })}
														className="rounded-full border border-border bg-background px-3 py-1 text-xs hover:bg-muted transition"
													>
														+ {keyword}
													</button>
												))}
											</div>
										)}
									</div>
								</aside>
							)}
						</div>

						{state.message && (
							<p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700">
								{state.message}
							</p>
						)}

						{state.error && (
							<p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
								{state.error}
							</p>
						)}
					</section>
				)}
			</section>
		</main>
	)
}

function ResumeSection({
	title,
	children,
	template,
}: {
	title: string
	children: React.ReactNode
	template: TemplateId
}) {
	return (
		<section className="space-y-3">
			<h3 className={cn("text-xs font-semibold uppercase", sectionClassByTemplate(template))}>{title}</h3>
			{children}
		</section>
	)
}

function EditableText({
	fieldPath,
	value,
	selectedField,
	styleConfig,
	onSelect,
	className,
}: {
	fieldPath: string
	value: string
	selectedField: string | null
	styleConfig?: FieldStyle
	onSelect: (fieldPath: string) => void
	className?: string
}) {
	const style = resolveStyle(styleConfig)

	return (
		<button
			type="button"
			onClick={() => onSelect(fieldPath)}
			className={cn(
				"w-full text-left rounded-md px-0.5 transition outline-none",
				selectedField === fieldPath
					? "ring-2 ring-sky-400/60 ring-offset-1 ring-offset-white"
					: "hover:bg-sky-50",
				className,
			)}
			style={{
				fontSize: `${style.fontSize}px`,
				fontWeight: style.fontWeight,
				color: style.color,
				textAlign: style.align,
				fontStyle: style.italic ? "italic" : "normal",
				textTransform: style.uppercase ? "uppercase" : "none",
				letterSpacing: `${style.letterSpacing}px`,
			}}
		>
			{value || "Click to edit"}
		</button>
	)
}
