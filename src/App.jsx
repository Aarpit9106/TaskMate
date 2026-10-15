import { useEffect, useState } from 'react'
import {
  STATUSES,
  getToday,
  validateAssignment,
  isOverdue,
  getCounts,
  filterByStatus,
  loadAssignments,
  saveAssignments,
} from './taskUtils.js'

const emptyForm = { title: '', subject: '', deadline: '', description: '' }

function App() {
  // Module 1 state: the assignment list and the form
  const [assignments, setAssignments] = useState(loadAssignments)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')

  // Module 2 state: the selected status filter
  const [filter, setFilter] = useState('All')

  // Save to LocalStorage every time the list changes
  useEffect(() => {
    saveAssignments(assignments)
  }, [assignments])

  const today = getToday()
  const counts = getCounts(assignments, today)
  const visibleAssignments = filterByStatus(assignments, filter)
    .slice()
    .sort((a, b) => a.deadline.localeCompare(b.deadline))

  // ---------- Module 1: Assignment Management ----------

  function handleChange(event) {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
  }

  function handleSubmit(event) {
    event.preventDefault()
    const formErrors = validateAssignment(form)
    setErrors(formErrors)
    if (Object.keys(formErrors).length > 0) {
      setMessage('')
      return // do not save invalid data
    }

    const cleanData = {
      title: form.title.trim(),
      subject: form.subject.trim(),
      deadline: form.deadline,
      description: form.description.trim(),
    }

    if (editingId) {
      setAssignments(
        assignments.map((a) => (a.id === editingId ? { ...a, ...cleanData } : a))
      )
      setMessage('Assignment updated successfully.')
    } else {
      const newAssignment = { id: Date.now().toString(), ...cleanData, status: 'Pending' }
      setAssignments([...assignments, newAssignment])
      setMessage('Assignment added successfully.')
    }
    setForm(emptyForm)
    setEditingId(null)
  }

  function handleEdit(assignment) {
    setForm({
      title: assignment.title,
      subject: assignment.subject,
      deadline: assignment.deadline,
      description: assignment.description,
    })
    setEditingId(assignment.id)
    setErrors({})
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCancelEdit() {
    setForm(emptyForm)
    setEditingId(null)
    setErrors({})
  }

  function handleDelete(assignment) {
    if (!window.confirm(`Delete "${assignment.title}"?`)) return
    setAssignments(assignments.filter((a) => a.id !== assignment.id))
    if (editingId === assignment.id) handleCancelEdit()
    setMessage('Assignment deleted.')
  }

  // ---------- Module 2: Task Tracking ----------

  function handleStatusChange(id, newStatus) {
    setAssignments(assignments.map((a) => (a.id === id ? { ...a, status: newStatus } : a)))
  }

  return (
    <div className="container">
      <header className="header">
        <h1>TaskMate</h1>
        <p>Manage your assignments and stay on track.</p>
      </header>

      {/* Dashboard summary cards */}
      <section className="cards">
        <div className="card">
          <span className="card-label">Total Assignments</span>
          <span className="card-value" data-testid="count-total">{counts.total}</span>
        </div>
        <div className="card pending">
          <span className="card-label">Pending</span>
          <span className="card-value" data-testid="count-pending">{counts.pending}</span>
        </div>
        <div className="card completed">
          <span className="card-label">Completed</span>
          <span className="card-value" data-testid="count-completed">{counts.completed}</span>
        </div>
        <div className="card overdue">
          <span className="card-label">Overdue</span>
          <span className="card-value" data-testid="count-overdue">{counts.overdue}</span>
        </div>
      </section>

      {/* Assignment form (used for both Add and Edit) */}
      <section className="panel">
        <h2>{editingId ? 'Edit Assignment' : 'Add New Assignment'}</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="field">
              <label htmlFor="title">Assignment Title *</label>
              <input id="title" name="title" type="text" maxLength={100}
                value={form.title} onChange={handleChange}
                placeholder="e.g. DBMS Lab Record" />
              {errors.title && <p className="error">{errors.title}</p>}
            </div>
            <div className="field">
              <label htmlFor="subject">Subject *</label>
              <input id="subject" name="subject" type="text" maxLength={60}
                value={form.subject} onChange={handleChange}
                placeholder="e.g. Database Management" />
              {errors.subject && <p className="error">{errors.subject}</p>}
            </div>
            <div className="field">
              <label htmlFor="deadline">Deadline *</label>
              <input id="deadline" name="deadline" type="date"
                value={form.deadline} onChange={handleChange} />
              {errors.deadline && <p className="error">{errors.deadline}</p>}
            </div>
          </div>
          <div className="field">
            <label htmlFor="description">Description (optional)</label>
            <textarea id="description" name="description" rows={2} maxLength={300}
              value={form.description} onChange={handleChange}
              placeholder="Any extra notes about this assignment" />
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn primary">
              {editingId ? 'Save Changes' : 'Add Assignment'}
            </button>
            {editingId && (
              <button type="button" className="btn" onClick={handleCancelEdit}>
                Cancel
              </button>
            )}
          </div>
          {message && <p className="success">{message}</p>}
        </form>
      </section>

      {/* Assignment list with status tracking */}
      <section className="panel">
        <div className="list-header">
          <h2>My Assignments</h2>
          <label className="filter">
            Filter by status:{' '}
            <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by status">
              <option value="All">All</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>

        {visibleAssignments.length === 0 ? (
          <p className="empty">
            {assignments.length === 0
              ? 'No assignments yet. Add your first assignment using the form above.'
              : 'No assignments match the selected filter.'}
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Subject</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleAssignments.map((a) => {
                const overdue = isOverdue(a, today)
                return (
                  <tr key={a.id} className={overdue ? 'overdue-row' : ''}>
                    <td className="title-cell">
                      <strong>{a.title}</strong>
                      {a.description && <div className="description">{a.description}</div>}
                    </td>
                    <td>{a.subject}</td>
                    <td className="deadline-cell">
                      {a.deadline}
                      {overdue && <span className="badge">Overdue</span>}
                    </td>
                    <td>
                      <select value={a.status} aria-label={`Status of ${a.title}`}
                        onChange={(e) => handleStatusChange(a.id, e.target.value)}>
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="actions">
                      <button className="btn small" onClick={() => handleEdit(a)}>Edit</button>
                      <button className="btn small danger" onClick={() => handleDelete(a)}>Delete</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </section>

      <footer className="footer">Today: {today} · Data is saved in this browser (LocalStorage).</footer>
    </div>
  )
}

export default App
