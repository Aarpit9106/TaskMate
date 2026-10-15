// Helper functions used by App.jsx.
// They are kept in a separate file so that they can be unit tested easily.

export const STATUSES = ['Pending', 'In Progress', 'Completed']

const STORAGE_KEY = 'taskmate-assignments'

// Returns today's date in the same format as <input type="date">: "YYYY-MM-DD".
// The local date is used (not UTC) so the result matches the user's calendar.
export function getToday() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Checks the form values and returns an object with error messages.
// An empty object means the form is valid.
export function validateAssignment(form) {
  const errors = {}
  if (!form.title || form.title.trim() === '') {
    errors.title = 'Assignment title is required.'
  }
  if (!form.subject || form.subject.trim() === '') {
    errors.subject = 'Subject is required.'
  }
  if (!form.deadline) {
    errors.deadline = 'Please select a deadline.'
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(form.deadline)) {
    // Bug fix TM-27: the browser date box allows years with 5 or 6 digits,
    // so only accept the normal "YYYY-MM-DD" format.
    errors.deadline = 'Please enter a valid deadline (the year must have 4 digits).'
  }
  return errors
}

// An assignment is overdue when its deadline is before today
// and it is not Completed. Dates are "YYYY-MM-DD" strings, so they
// can be compared directly as text.
export function isOverdue(assignment, today = getToday()) {
  return assignment.status !== 'Completed' && assignment.deadline < today
}

// Calculates the numbers shown on the four dashboard cards.
export function getCounts(assignments, today = getToday()) {
  return {
    total: assignments.length,
    pending: assignments.filter((a) => a.status === 'Pending').length,
    completed: assignments.filter((a) => a.status === 'Completed').length,
    overdue: assignments.filter((a) => isOverdue(a, today)).length,
  }
}

// Returns only the assignments that match the selected status filter.
export function filterByStatus(assignments, filter) {
  if (filter === 'All') return assignments
  return assignments.filter((a) => a.status === filter)
}

// Reads saved assignments from the browser's LocalStorage.
export function loadAssignments() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    const list = saved ? JSON.parse(saved) : []
    return Array.isArray(list) ? list : []
  } catch {
    // If the saved data is damaged, start with an empty list.
    return []
  }
}

// Saves the full assignment list to the browser's LocalStorage.
export function saveAssignments(assignments) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments))
}
