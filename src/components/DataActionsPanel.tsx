type ImportPanelProps = {
  requirementCount: number
  imported: boolean
  onImport: () => void
}

type ExportPanelProps = {
  onExport: () => void
}

type ResetPanelProps = {
  onReset: () => void
}

export function ImportPanel({ requirementCount, imported, onImport }: ImportPanelProps) {
  return (
    <section className="import-panel" aria-labelledby="import-heading">
      <div>
        <p className="label">Sample import</p>
        <h2 id="import-heading">Listing batch</h2>
        <p>
          {imported
            ? 'The sample batch is already in your signals. Reset the demo data to import it again.'
            : `Add ${requirementCount} requirements from a sample listing batch.`}
        </p>
      </div>
      <button disabled={imported} onClick={onImport} type="button">
        {imported ? 'Sample batch imported' : 'Import sample batch'}
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
        <p>Download the current signals and build queue as JSON.</p>
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
        <p className="label">Start over</p>
        <h2 id="reset-heading">Reset demo data</h2>
        <p>Restore the sample signals, task statuses, and import state.</p>
      </div>
      <button className="reset-action-btn" onClick={onReset} type="button">
        Reset to defaults
      </button>
    </section>
  )
}
