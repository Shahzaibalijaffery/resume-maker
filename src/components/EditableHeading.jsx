function EditableHeading({
  headingKey,
  title,
  isEditing,
  draftValue,
  options,
  onStartEdit,
  onDraftChange,
  onSave,
  onCancel,
  disableEdit = false
}) {
  return (
    <div className="editable-heading-row">
      {isEditing ? (
        <>
          <select
            className="ui-select heading-edit-input"
            value={draftValue}
            onChange={(e) => onDraftChange(e.target.value)}
          >
            {(options || []).map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <button type="button" className="heading-action-btn primary" onClick={onSave}>
            Save
          </button>
          <button type="button" className="heading-action-btn secondary" onClick={onCancel}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <h3>{title}</h3>
          {!disableEdit && (
            <button type="button" className="heading-action-btn secondary" onClick={() => onStartEdit(headingKey)}>
              Edit
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default EditableHeading
