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
    evidence: 'Some frontend roles mention Storybook and reusable UI libraries.',
    projectAngle: 'Extract reusable filters, metric cards, forms, and status controls.',
  },
]

export const initialTasks: ProjectTask[] = [
  {
    id: 1,
    title: 'Build a typed dashboard',
    requirement: 'React, TypeScript, state management',
    status: 'Done',
  },
  {
    id: 2,
    title: 'Add a REST client with loading and error states',
    requirement: 'REST APIs, async UI states',
    status: 'Done',
  },
  {
    id: 3,
    title: 'Write component tests',
    requirement: 'Testing, maintainability',
    status: 'In progress',
  },
  {
    id: 4,
    title: 'Extract a reusable component set',
    requirement: 'Reusable UI, clean code',
    status: 'Next',
  },
  {
    id: 5,
    title: 'Deploy a preview build',
    requirement: 'CI/CD, deployment',
    status: 'Next',
  },
]

export const initialState: JobPulseState = {
  signals: initialSignals,
  tasks: initialTasks,
  importedBatchIds: [],
}

// Sample listings for the demo. The company names are fictional.
export const targetListings: TargetListing[] = [
  {
    id: 1,
    company: 'Northwind Labs',
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
      'Most requirements are already tracked. Docker and cloud basics are the main gap.',
  },
  {
    id: 2,
    company: 'Fabrikam',
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
    projectMove: 'Covered by the tracked skills. More REST practice would strengthen it.',
  },
  {
    id: 3,
    company: 'Contoso Digital',
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
      'Next.js, Tailwind, and Storybook are gaps. A component library project would cover them.',
  },
  {
    id: 4,
    company: 'Tailspin Commerce',
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
      'PostgreSQL and payments are gaps. A small checkout project would cover them.',
  },
]

export const integrationScenarios: IntegrationScenario[] = [
  {
    id: 1,
    status: 'Ready',
    title: 'Listing batch synced',
    description: 'New requirements from the latest batch are merged into your signals.',
    sample: '5 signals synced from the latest Remote/EU search.',
  },
  {
    id: 2,
    status: 'Loading',
    title: 'Fetching listing batch',
    description: 'The dashboard stays usable while the job board responds.',
    sample: 'Checking React, TypeScript, remote, and Europe filters.',
  },
  {
    id: 3,
    status: 'Empty',
    title: 'No matching listings',
    description:
      'Nothing matched the current filters, so the panel suggests what to change.',
    sample: 'Try broadening the location filter or lowering the seniority match.',
  },
  {
    id: 4,
    status: 'Error',
    title: 'Source unavailable',
    description:
      'The job board did not respond. Data saved on this device is unchanged.',
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
        'Most roles mention Git, reliable delivery, and CI/CD habits as signs of maintainable work.',
      projectAngle:
        'Run lint, tests, and build through GitHub Actions on every push.',
    },
  ],
}
