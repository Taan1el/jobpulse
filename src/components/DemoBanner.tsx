type DemoBannerProps = {
  onReset: () => void
}

export function DemoBanner({ onReset }: DemoBannerProps) {
  function handleReset() {
    if (window.confirm('Reset the sample signals and build queue back to the seed data?')) {
      onReset()
    }
  }

  return (
    <output className="demo-bar">
      <div className="demo-bar-inner">
        <span>Demo: everything runs in your browser with sample data.</span>
        <span className="demo-bar-links">
          <button className="link-btn" onClick={handleReset} type="button">
            Reset sample data
          </button>
          <a href="https://github.com/Taan1el/jobpulse" rel="noreferrer" target="_blank">
            Source on GitHub
          </a>
        </span>
      </div>
    </output>
  )
}
