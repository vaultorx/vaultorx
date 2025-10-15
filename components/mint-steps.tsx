"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface MintStep {
  id: number
  title: string
  description: string
}

interface MintStepsProps {
  currentStep: number
  steps: MintStep[]
}

export function MintSteps({ currentStep, steps }: MintStepsProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                  currentStep > step.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : currentStep === step.id
                      ? "border-primary bg-background text-primary"
                      : "border-muted bg-background text-muted-foreground",
                )}
              >
                {currentStep > step.id ? <Check className="h-5 w-5" /> : <span>{step.id}</span>}
              </div>
              <div className="mt-2 text-center">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground hidden sm:block">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-[2px] flex-1 mx-2 transition-colors",
                  currentStep > step.id ? "bg-primary" : "bg-muted",
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
