function FormAccordion({
  sectionKey,
  title,
  hint,
  badge,
  isOpen,
  onToggle,
  children
}) {
  const panelId = `form-accordion-panel-${sectionKey}`

  return (
    <section className={`form-accordion-item${isOpen ? ' is-open' : ''}`}>
      <button
        type="button"
        className="form-accordion-trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span className="form-accordion-badge">{badge}</span>
        <span className="form-accordion-copy">
          <span className="form-accordion-title">{title}</span>
          <span className="form-accordion-hint">{hint}</span>
        </span>
        <span className="form-accordion-chevron" aria-hidden="true" />
      </button>
      <div id={panelId} className="form-accordion-panel" aria-hidden={!isOpen}>
        <div className="form-accordion-panel-inner">
          {children}
        </div>
      </div>
    </section>
  )
}

export default FormAccordion
