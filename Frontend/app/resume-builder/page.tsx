"use client"

import { useState } from "react"
import { Download, Loader2, Sparkles } from "lucide-react"
import { buildResume } from "@/services/resumeBuilder"

type ResumePayload = {
	name: string
	email: string
	phone: string
	summary: string
	skills: string
	experience: string
	education: string
}

const initialForm: ResumePayload = {
	name: "",
	email: "",
	phone: "",
	summary: "",
	skills: "",
	experience: "",
	education: "",
}

export default function ResumeBuilderPage() {
	const [form, setForm] = useState<ResumePayload>(initialForm)
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	const handleChange = (field: keyof ResumePayload, value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }))
	}

	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setLoading(true)
		setError(null)
		setMessage(null)

		const result = await buildResume(form)

		if (result?.success) {
			setMessage("Resume generated and download started.")
		} else {
			setError(result?.message || "Failed to generate resume. Please try again.")
		}

		setLoading(false)
	}

	return (
		<main className="min-h-screen px-4 sm:px-6 lg:px-8 py-10">
			<section className="max-w-5xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl sm:text-4xl font-bold">Resume Builder</h1>
					<p className="text-muted-foreground mt-2">
						Build and download a polished resume from your details.
					</p>
				</div>

				<form
					onSubmit={onSubmit}
					className="bg-card border border-border rounded-2xl p-5 sm:p-8 space-y-5"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<InputField
							label="Full Name"
							value={form.name}
							onChange={(value) => handleChange("name", value)}
							required
						/>
						<InputField
							label="Email"
							type="email"
							value={form.email}
							onChange={(value) => handleChange("email", value)}
							required
						/>
						<InputField
							label="Phone"
							value={form.phone}
							onChange={(value) => handleChange("phone", value)}
						/>
					</div>

					<TextAreaField
						label="Professional Summary"
						value={form.summary}
						onChange={(value) => handleChange("summary", value)}
						placeholder="Write a short summary about your profile and goals"
						required
					/>

					<TextAreaField
						label="Skills"
						value={form.skills}
						onChange={(value) => handleChange("skills", value)}
						placeholder="Example: React, TypeScript, Node.js, Product Design"
						required
					/>

					<TextAreaField
						label="Experience"
						value={form.experience}
						onChange={(value) => handleChange("experience", value)}
						placeholder="List work experience, achievements, and impact"
						required
					/>

					<TextAreaField
						label="Education"
						value={form.education}
						onChange={(value) => handleChange("education", value)}
						placeholder="List degrees, institutions, and graduation years"
						required
					/>

					<button
						type="submit"
						disabled={loading}
						className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-teal-400 to-blue-500 text-white font-semibold hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
					>
						{loading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
						{loading ? "Generating Resume..." : "Generate & Download"}
					</button>

					{message && (
						<p className="text-sm text-emerald-500 inline-flex items-center gap-2">
							<Sparkles size={14} />
							{message}
						</p>
					)}

					{error && <p className="text-sm text-destructive">{error}</p>}
				</form>
			</section>
		</main>
	)
}

function InputField({
	label,
	value,
	onChange,
	type = "text",
	required = false,
}: {
	label: string
	value: string
	onChange: (value: string) => void
	type?: string
	required?: boolean
}) {
	return (
		<label className="block space-y-2">
			<span className="text-sm font-medium">{label}</span>
			<input
				type={type}
				value={value}
				onChange={(event) => onChange(event.target.value)}
				required={required}
				className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40"
			/>
		</label>
	)
}

function TextAreaField({
	label,
	value,
	onChange,
	placeholder,
	required = false,
}: {
	label: string
	value: string
	onChange: (value: string) => void
	placeholder?: string
	required?: boolean
}) {
	return (
		<label className="block space-y-2">
			<span className="text-sm font-medium">{label}</span>
			<textarea
				value={value}
				onChange={(event) => onChange(event.target.value)}
				placeholder={placeholder}
				required={required}
				rows={4}
				className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40"
			/>
		</label>
	)
}
