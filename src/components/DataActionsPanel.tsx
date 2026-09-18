type ImportPanelProps = {
  requirementCount: number
  imported: boolean
  onImport: () => void
}

type ExportPanelProps = {
  onExport: () => void
}

export function ImportPanel({ requirementCount, imported, onImport }: ImportPanelProps) {
  return (
    <section aria-labelledby="import-heading" className="data-action">
      <h3 className="panel-heading" id="import-heading">
        Signal batch
      </h3>
      <p>
        {imported
          ? 'The sample batch is already in your signals. Reset the demo data to import it again.'
          : `Add ${requirementCount} requirements from a sample signal batch.`}
      </p>
      <button className="btn btn-secondary" disabled={imported} onClick={onImport} type="button">
        {imported ? 'Sample batch imported' : 'Import sample batch'}
      </button>
    </section>
  )
}

export function ExportPanel({ onExport }: ExportPanelProps) {
  return (
    <section aria-labelledby="export-heading" className="data-action">
      <h3 className="panel-heading" id="export-heading">
        Export snapshot
      </h3>
      <p>Download the current signals and build queue as JSON.</p>
      <button className="btn btn-secondary" onClick={onExport} type="button">
        Export JSON
      </button>
    </section>
  )
}
