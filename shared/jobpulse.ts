export type SignalCategory = 'Frontend' | 'Backend' | 'Product' | 'Quality'

export type JobSignal = {
  id: number
  skill: string
  category: SignalCategory
  mentions: number
  evidence: string
  projectAngle: string
}

export type ProjectTask = {
  id: number
  title: string
  requirement: string
  status: 'Next' | 'In progress' | 'Done'
}

export type JobPulseState = {
  signals: JobSignal[]
  tasks: ProjectTask[]
}

export const initialSignals: JobSignal[] = [
  {
    id: 1,
    skill: 'React + TypeScript',
    category: 'Frontend',
    mentions: 9,
    evidence: 'Remote EU listings repeatedly ask for typed React interfaces.',
    projectAngle: 'Build an interactive dashboard with typed components and state.',
  },
  {
    id: 2,
    skill: 'Node APIs',
    category: 'Backend',
    mentions: 7,
    evidence: 'Full-stack roles mention backend APIs, integrations, and maintenance.',
    projectAngle: 'Add a small API layer for saved job signals and project notes.',
  },
  {
    id: 3,
    skill: 'SaaS workflows',
    category: 'Product',
    mentions: 6,
    evidence: 'Listings describe modern SaaS platforms and customer-facing tools.',
    projectAngle: 'Model a real workflow with filtering, prioritization, and summaries.',
  },
  {
    id: 4,
    skill: 'Testing and linting',
    category: 'Quality',
    mentions: 5,
    evidence: 'Most roles still expect clean delivery habits.',
    projectAngle: 'Keep builds green and add focused component or domain tests.',
  },
]

export const initialTasks: ProjectTask[] = [
  {
    id: 1,
    title: 'Ship the signal dashboard',
    requirement: 'React, TypeScript, product thinking',
    status: 'Done',
  },
  {
    id: 2,
    title: 'Add persistent API storage',
    requirement: 'Node APIs, data modeling',
    status: 'In progress',
  },
  {
    id: 3,
    title: 'Write acceptance tests',
    requirement: 'Quality habits, maintainability',
    status: 'Next',
  },
]

export const initialState: JobPulseState = {
  signals: initialSignals,
  tasks: initialTasks,
}
