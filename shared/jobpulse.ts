export type SignalCategory = 'Frontend' | 'Backend' | 'Product' | 'Quality'
export type SignalSortOption = 'mentions' | 'alphabetical'

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

export type TargetListing = {
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

export type ImportedRequirement = {
  skill: string
  category: SignalCategory
  evidence: string
  projectAngle: string
}

export type ListingBatch = {
  id: string
  requirements: ImportedRequirement[]
}

export type JobPulseState = {
  signals: JobSignal[]
  tasks: ProjectTask[]
  importedBatchIds: string[]
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
    skill: 'REST integration',
    category: 'Backend',
    mentions: 7,
    evidence: 'Frontend and full-stack listings mention REST APIs and integrations.',
    projectAngle: 'Show clean loading, error, empty, and saved states around data flows.',
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
  {
    id: 5,
    skill: 'Component systems',
    category: 'Frontend',
    mentions: 4,
    evidence: 'Frontend stretch roles mention Storybook and reusable UI libraries.',
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
    title: 'Add job-fit matrix',
    requirement: 'Product thinking, readable project mapping',
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
    requirement: 'Project polish, clear demo',
    status: 'Next',
  },
]

export const initialState: JobPulseState = {
  signals: initialSignals,
  tasks: initialTasks,
  importedBatchIds: [],
}

export const targetListings: TargetListing[] = [
  {
    id: 1,
    company: 'Operations Tracker',
    role: 'Full-Stack JavaScript Developer',
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
      'Use JobPulse to show typed UI, project prioritization, persistence, tests, and deployment readiness.',
  },
  {
    id: 2,
    company: 'Frontend Console',
    role: 'Frontend Engineer',
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
      'Polish JobPulse interactions, responsive states, README clarity, and commit history.',
  },
  {
    id: 3,
    company: 'Component Studio OU',
    role: 'Frontend Developer, React / Next.js',
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
      'Create a separate component-library repo after JobPulse has reusable UI patterns worth extracting.',
  },
  {
    id: 4,
    company: 'SaaS Metrics Lab',
    role: 'Full-Stack Web Developer TypeScript',
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
    title: 'Imported job signals',
    description:
      'The UI has usable data and can summarize repeated requirements from a listing batch.',
    sample: '5 signals synced from the latest Remote/EU search.',
  },
  {
    id: 2,
    status: 'Loading',
    title: 'Fetching listing batch',
    description:
      'The dashboard keeps the user oriented while a remote job-board request is in flight.',
    sample: 'Checking React, TypeScript, remote, and Europe filters.',
  },
  {
    id: 3,
    status: 'Empty',
    title: 'No matching listings',
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

export const sampleListingBatch: ListingBatch = {
  id: 'sample-batch',
  requirements: [
    {
      skill: 'Accessibility',
      category: 'Quality',
      evidence:
        'Frontend listings increasingly mention accessible interfaces, semantic markup, and keyboard support.',
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
        'Most roles mention Git, reliable delivery, and CI/CD habits as proof of maintainable work.',
      projectAngle:
        'Run lint, tests, and build through GitHub Actions on every push.',
    },
  ],
}
