type ImportPanelProps = {
  importedCount: number
  onImport: () => void
}

type ExportPanelProps = {
  onExport: () => void
}

type ResetPanelProps = {
  onReset: () => void
}

export function ImportPanel({ importedCount, onImport }: ImportPanelProps) {
  return (
    <section className="import-panel" aria-labelledby="import-heading">
      <div>
        <p className="label">Mock import</p>
        <h2 id="import-heading">Listing batch</h2>
        <p>
          Load {importedCount} sample requirements to demonstrate REST-style data
          ingestion without a backend.
        </p>
      </div>
      <button onClick={onImport} type="button">
        Import sample batch
      </button>
    </section>
  )
}

export function ExportPanel({ onExport }: ExportPanelProps) {
  return (
    <section className="export-panel" aria-labelledby="export-heading">
      <div>
        <p className="label">Data handoff</p>
        <h2 id="export-heading">Export snapshot</h2>
        <p>
          Download the current signals and build queue for a project note or
          project-planning review.
        </p>
      </div>
      <button onClick={onExport} type="button">
        Export JSON
      </button>
    </section>
  )
}

export function ResetDataPanel({ onReset }: ResetPanelProps) {
  return (
    <section className="reset-panel" aria-labelledby="reset-heading">
      <div>
        <p className="label">Reviewer helper</p>
        <h2 id="reset-heading">Reset demo data</h2>
        <p>
          Restore initial signals and task statuses back to pristine defaults.
        </p>
      </div>
      <button className="reset-action-btn" onClick={onReset} type="button">
        Reset to defaults
      </button>
    </section>
  )
}
