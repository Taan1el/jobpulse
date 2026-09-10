export type SignalCategory = 'Frontend' | 'Backend' | 'Product' | 'Quality'
export type SignalSortOption = 'mentions' | 'alphabetical'

export type WorkSignal = {
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

export type ReferenceProfile = {
  id: number
  company: string
  role: string
  fit: 'Best match' | 'Good match' | 'Stretch'
  requirements: string[]
  projectMove: string
}

export type IntegrationScenario = {
  id: number
  status: 'Loading' | 'Ready' | 'Empty' | 'Error'
  title: string
  description: string
  sample: string
}

export type ImportedSignal = {
  skill: string
  category: SignalCategory
  evidence: string
  projectAngle: string
}

export type SignalDeskState = {
  signals: WorkSignal[]
  tasks: ProjectTask[]
}

export const initialSignals: WorkSignal[] = [
  {
    id: 1,
    skill: 'React + TypeScript',
    category: 'Frontend',
    mentions: 9,
    evidence: 'Recent project reviews repeatedly highlighted typed React interfaces.',
    projectAngle: 'Build an interactive dashboard with typed components and state.',
  },
  {
    id: 2,
    skill: 'REST integration',
    category: 'Backend',
    mentions: 7,
    evidence: 'Integration-heavy web apps need clear REST loading and failure states.',
    projectAngle: 'Show clean loading, error, empty, and saved states around data flows.',
  },
  {
    id: 3,
    skill: 'SaaS workflows',
    category: 'Product',
    mentions: 6,
    evidence: 'SaaS workflows benefit from filtering, prioritization, and summaries.',
    projectAngle: 'Model a real workflow with filtering, prioritization, and summaries.',
  },
  {
    id: 4,
    skill: 'Testing and linting',
    category: 'Quality',
    mentions: 5,
    evidence: 'Reliable product work depends on clean checks and focused tests.',
    projectAngle: 'Keep builds green and add focused component or domain tests.',
  },
  {
    id: 5,
    skill: 'Component systems',
    category: 'Frontend',
    mentions: 4,
    evidence: 'Reusable UI patterns reduce duplicated dashboard controls.',
    projectAngle: 'Extract reusable filters, metric cards, forms, and status controls.',
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
    title: 'Add reference matrix',
    requirement: 'Product thinking, scannable project mapping',
    status: 'Done',
  },
  {
    id: 3,
    title: 'Write acceptance tests',
    requirement: 'Quality habits, maintainability',
    status: 'Done',
  },
  {
    id: 4,
    title: 'Extract dashboard components',
    requirement: 'Reusable UI, clean code, maintainability',
    status: 'Done',
  },
  {
    id: 5,
    title: 'Add screenshots and responsive review',
    requirement: 'Product polish, clear demo flow',
    status: 'Next',
  },
]

export const initialState: SignalDeskState = {
  signals: initialSignals,
  tasks: initialTasks,
}

export const referenceProfiles: ReferenceProfile[] = [
  {
    id: 1,
    company: 'Operations Tracker',
    role: 'Full-stack dashboard profile',
    fit: 'Best match',
    requirements: [
      'React',
      'TypeScript',
      'Node fundamentals',
      'Database basics',
      'Docker or cloud basics',
      'CI/CD habits',
    ],
    projectMove:
      'Use SignalDesk to track typed UI, project prioritization, persistence, tests, and release readiness.',
  },
  {
    id: 2,
    company: 'Frontend Console',
    role: 'Client-side workflow profile',
    fit: 'Good match',
    requirements: [
      'React',
      'TypeScript',
      'REST APIs',
      'Git',
      'Clean code',
      'Independent delivery',
    ],
    projectMove:
      'Polish SignalDesk interactions, responsive states, README clarity, and change history.',
  },
  {
    id: 3,
    company: 'Component Studio',
    role: 'Reusable interface profile',
    fit: 'Stretch',
    requirements: [
      'React',
      'Next.js',
      'TypeScript',
      'Tailwind',
      'Storybook',
      'Component libraries',
    ],
    projectMove:
      'Create a separate component-library repo after SignalDesk has reusable UI patterns worth extracting.',
  },
  {
    id: 4,
    company: 'SaaS Metrics Lab',
    role: 'Product analytics profile',
    fit: 'Stretch',
    requirements: [
      'TypeScript',
      'Next or Astro',
      'PostgreSQL',
      'Vercel',
      'Payments',
      'Vitest',
    ],
    projectMove:
      'Build a SaaS funnel demo later with checkout, experiments, analytics events, and tests.',
  },
]

export const integrationScenarios: IntegrationScenario[] = [
  {
    id: 1,
    status: 'Ready',
    title: 'Imported project signals',
    description:
      'The UI has usable data and can summarize repeated requirements from a planning batch.',
    sample: '5 signals synced from the latest Remote/EU search.',
  },
  {
    id: 2,
    status: 'Loading',
    title: 'Fetching planning batch',
    description:
      'The dashboard keeps the user oriented while a remote data request is in flight.',
    sample: 'Checking React, TypeScript, remote, and Europe filters.',
  },
  {
    id: 3,
    status: 'Empty',
    title: 'No matching signals',
    description:
      'The UI explains the empty state and suggests changing filters instead of showing a blank panel.',
    sample: 'Try broadening the location filter or lowering the seniority match.',
  },
  {
    id: 4,
    status: 'Error',
    title: 'Source unavailable',
    description:
      'The dashboard gives a human-readable failure state and keeps local planning data intact.',
    sample: 'Remote source timed out. Last local snapshot is still available.',
  },
]

export const sampleSignalBatch: ImportedSignal[] = [
  {
    skill: 'Accessibility',
    category: 'Quality',
    evidence:
      'Frontend reviews increasingly call out accessible interfaces, semantic markup, and keyboard support.',
    projectAngle:
      'Add accessible names, pressed states, focus styles, and tests for key interactive controls.',
  },
  {
    skill: 'Responsive dashboards',
    category: 'Frontend',
    evidence:
      'React dashboard roles expect layouts that stay readable across laptop and mobile breakpoints.',
    projectAngle:
      'Capture desktop and mobile screenshots and refine cramped responsive sections.',
  },
  {
    skill: 'CI workflows',
    category: 'Quality',
    evidence:
      'Reliable delivery depends on Git hygiene, CI checks, and maintainable work.',
    projectAngle:
      'Run lint, tests, and build through GitHub Actions on every push.',
  },
]
