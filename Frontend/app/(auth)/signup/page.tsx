import React from "react";
import { Rocket, Sparkles, UserPlus } from "lucide-react";

import { SignUpForm } from "./components/SignUpForm";

export default function SingUp() {
    return (
        <section className="relative h-full px-4 py-3 sm:px-6 lg:px-8 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-linear-to-br from-teal-400/15 to-blue-500/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-linear-to-br from-cyan-400/15 to-sky-500/15 rounded-full blur-3xl" />

            <div className="relative mx-auto h-full w-full max-w-6xl grid lg:grid-cols-2 gap-6 items-center">
                <div className="hidden xl:block">
                    <div className="rounded-3xl border border-border/60 bg-card/50 backdrop-blur p-6">
                        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                            <Sparkles size={14} className="text-teal-400" />
                            Start Free
                        </span>
                        <h1 className="mt-3 text-3xl font-bold leading-tight">Build Your Career Stack with AI</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Create your account and access ATS, matching, and resume tools instantly.
                        </p>

                        <div className="mt-5 space-y-2.5">
                            <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/60 p-3">
                                <UserPlus size={18} className="text-blue-500" />
                                <span className="text-sm">Onboarding in under a minute</span>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/60 p-3">
                                <Rocket size={18} className="text-emerald-500" />
                                <span className="text-sm">Instant access to all core services</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-center lg:justify-end">
                    <SignUpForm />
                </div>
            </div>
        </section>
    );
}