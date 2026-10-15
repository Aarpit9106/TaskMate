// Unit tests for the helper functions in src/taskUtils.js.
// Uses the test runner that is built into Node.js, so no extra packages are needed.
// Run with:  npm test

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validateAssignment, isOverdue, getCounts, filterByStatus } from '../src/taskUtils.js'

const TODAY = '2026-10-15'

// ---------- validateAssignment ----------

test('UT-01: valid assignment details produce no errors', () => {
  const errors = validateAssignment({ title: 'DBMS Lab Record', subject: 'DBMS', deadline: '2026-10-20', description: '' })
  assert.deepEqual(errors, {})
})

test('UT-02: empty or blank title is rejected', () => {
  assert.ok(validateAssignment({ title: '', subject: 'DBMS', deadline: '2026-10-20' }).title)
  assert.ok(validateAssignment({ title: '    ', subject: 'DBMS', deadline: '2026-10-20' }).title)
})

test('UT-03: empty subject is rejected', () => {
  const errors = validateAssignment({ title: 'Lab Record', subject: '', deadline: '2026-10-20' })
  assert.equal(errors.subject, 'Subject is required.')
})

test('UT-04: missing deadline is rejected', () => {
  const errors = validateAssignment({ title: 'Lab Record', subject: 'DBMS', deadline: '' })
  assert.equal(errors.deadline, 'Please select a deadline.')
})

test('UT-05: all three required fields missing gives three errors', () => {
  const errors = validateAssignment({ title: '', subject: '', deadline: '' })
  assert.equal(Object.keys(errors).length, 3)
})

test('UT-14: deadline with a year longer than 4 digits is rejected (bug TM-27)', () => {
  assert.ok(validateAssignment({ title: 'Lab', subject: 'Physics', deadline: '20255-12-20' }).deadline)
  assert.ok(validateAssignment({ title: 'Lab', subject: 'Physics', deadline: '202612-01-01' }).deadline)
  assert.equal(validateAssignment({ title: 'Lab', subject: 'Physics', deadline: '9999-12-31' }).deadline, undefined)
})

// ---------- isOverdue (Boundary Value Analysis around today) ----------

test('UT-06: deadline yesterday and not completed is overdue', () => {
  assert.equal(isOverdue({ deadline: '2026-10-14', status: 'Pending' }, TODAY), true)
  assert.equal(isOverdue({ deadline: '2026-10-14', status: 'In Progress' }, TODAY), true)
})

test('UT-07: deadline equal to today is NOT overdue', () => {
  assert.equal(isOverdue({ deadline: '2026-10-15', status: 'Pending' }, TODAY), false)
})

test('UT-08: deadline tomorrow is NOT overdue', () => {
  assert.equal(isOverdue({ deadline: '2026-10-16', status: 'Pending' }, TODAY), false)
})

test('UT-09: completed assignment with a past deadline is NOT overdue', () => {
  assert.equal(isOverdue({ deadline: '2026-10-01', status: 'Completed' }, TODAY), false)
})

test('UT-10: date comparison works across month and year boundaries', () => {
  assert.equal(isOverdue({ deadline: '2026-09-30', status: 'Pending' }, '2026-10-01'), true)
  assert.equal(isOverdue({ deadline: '2025-12-31', status: 'Pending' }, '2026-01-01'), true)
  assert.equal(isOverdue({ deadline: '2027-01-01', status: 'Pending' }, '2026-12-31'), false)
})

// ---------- getCounts and filterByStatus ----------

const sample = [
  { id: '1', deadline: '2026-10-20', status: 'Pending' },
  { id: '2', deadline: '2026-10-12', status: 'Pending' }, // overdue
  { id: '3', deadline: '2026-10-15', status: 'In Progress' }, // due today, not overdue
  { id: '4', deadline: '2026-10-10', status: 'Completed' }, // past but completed
  { id: '5', deadline: '2026-10-11', status: 'In Progress' }, // overdue
]

test('UT-11: dashboard counts are calculated correctly', () => {
  assert.deepEqual(getCounts(sample, TODAY), { total: 5, pending: 2, completed: 1, overdue: 2 })
})

test('UT-12: dashboard counts for an empty list are all zero', () => {
  assert.deepEqual(getCounts([], TODAY), { total: 0, pending: 0, completed: 0, overdue: 0 })
})

test('UT-13: filter returns only matching statuses', () => {
  assert.equal(filterByStatus(sample, 'All').length, 5)
  assert.deepEqual(filterByStatus(sample, 'Pending').map((a) => a.id), ['1', '2'])
  assert.deepEqual(filterByStatus(sample, 'In Progress').map((a) => a.id), ['3', '5'])
  assert.deepEqual(filterByStatus(sample, 'Completed').map((a) => a.id), ['4'])
})
