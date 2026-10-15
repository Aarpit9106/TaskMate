# TaskMate – Test Cases and Results

**Project:** TaskMate — Student Task and Assignment Management System
**Test date:** 15 October 2026 (all overdue results below are relative to this date)
**Build tested:** TaskMate 1.0.0 (React 18.3.1, Vite 6.4.4), `npm run dev` on http://localhost:5173
**Browser:** Chromium (Playwright 1.56), window 1280 × 860, time zone Asia/Kolkata

## How the tests were executed

| Type | Tool | What it covers | How to repeat |
|---|---|---|---|
| Unit tests (automated) | Node.js built-in test runner (`node:test`) | `validateAssignment`, `isOverdue`, `getCounts`, `filterByStatus` in `src/taskUtils.js` | `npm test` |
| Functional / integration / BVA / EP / validation tests (TC-01 to TC-18) | Real browser driven by a Playwright script against the running app | The two modules through the user interface | Follow the steps in the table by hand, or see `evidence/testing/run_ui_tests.py` and `run_bug_checks.py` |

The TC tests were executed through browser automation (the script clicks and types in the real UI and reads the visible results). They were not executed by hand. Before the demo, repeat a few of them by hand (for example TC-01, TC-02, TC-11 and TC-12).

Sample data used: DBMS Lab Record (2026-10-20), Operating Systems Assignment 2 (2026-10-12), Software Engineering Case Study (2026-10-15 = today), Computer Networks Quiz Prep (2026-10-10), Maths Tutorial Sheet 4 (2026-10-16 = tomorrow).

Module key: **M1** = Assignment Management, **M2** = Task Tracking and Dashboard.

## Test case table

| Test Case ID | Module | Test Scenario | Test Data | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| TC-01 | M1 | Add an assignment with valid details | Title "DBMS Lab Record", Subject "Database Management Systems", Deadline 2026-10-20, Description "Experiments 1-8 with output screenshots" | New row appears with status Pending; Total = 1, Pending = 1; form is cleared; success message shown | Row added with status Pending; Total = 1, Pending = 1; "Assignment added successfully." shown; form cleared | Pass |
| TC-02 | M1 | Reject an empty assignment title | Title "" and Title "     " (spaces only); Subject "Operating Systems"; Deadline 2026-10-12 | "Assignment title is required." shown; nothing saved | Both inputs showed "Assignment title is required."; Total stayed 1 | Pass |
| TC-03 | M1 | Reject an empty subject | Title "Operating Systems Assignment 2"; Subject ""; Deadline 2026-10-12 | "Subject is required." shown; nothing saved | Only "Subject is required." shown; Total stayed 1 | Pass |
| TC-04 | M1 | Reject a missing deadline | Title and Subject filled; Deadline empty | "Please select a deadline." shown; nothing saved | Only "Please select a deadline." shown; Total stayed 1 | Pass |
| TC-05 | M1 | View saved assignments | 5 sample assignments added | All 5 listed with title, subject, deadline, status, Edit and Delete | 5 rows listed, sorted by deadline; each row has status dropdown, Edit and Delete (5/5) | Pass |
| TC-06 | M1 | Edit assignment details (and Cancel) | Edit "Maths Tutorial Sheet 4": title → "Maths Tutorial Sheet 4 (Revised)", deadline 2026-10-16 → 2026-10-13 | Form loads existing values; "Save Changes" updates the same row; no duplicate; Cancel discards changes | Form loaded with old values and button changed to "Save Changes"; row updated with new title and deadline; still 5 rows; Cancel kept the original data | Pass |
| TC-07 | M1 | Delete an assignment | Delete "Operating Systems Assignment 2": first click Cancel in the confirm box, then OK | Cancel keeps the row; OK removes it; Total 5 → 4 | Row kept after Cancel; removed after OK; Total 5 → 4 | Pass |
| TC-08 | M1 | Data persists after browser refresh | 4 assignments with mixed statuses, then page reload | Same assignments, statuses and counts after reload | LocalStorage held 4 items; after reload the 4 rows, statuses and card values were identical | Pass |
| TC-09 | M2 | Change status Pending → In Progress | "Software Engineering Case Study" | Status shows In Progress; Pending 5 → 4 | Status "In Progress"; Pending = 4 | Pass |
| TC-10 | M2 | Change status to Completed | "DBMS Lab Record" → Completed | Status shows Completed; Completed = 1; Pending = 3 | Status "Completed"; Completed = 1, Pending = 3 | Pass |
| TC-11 | M2 | Filter assignments by status | Filter = Pending, In Progress, Completed, All | Only matching rows: Pending 2, In Progress 1, Completed 2, All 5 | Pending 2, In Progress 1, Completed 2, All 5 rows; every shown row matched the filter | Pass |
| TC-12 | M2 | Identify overdue assignments | OS Assignment 2 (2026-10-12, Pending), CN Quiz Prep (2026-10-10, Pending); today 2026-10-15 | Both show "Overdue" badge; Overdue card = 2 | Both rows showed the Overdue badge; Overdue card = 2 | Pass |
| TC-13 | M2 | Completed assignment is not overdue | CN Quiz Prep (past deadline) → Completed | Overdue badge removed; Overdue 2 → 1 | Badge removed; Overdue 2 → 1 | Pass |
| TC-14 | M2 | Dashboard counts are correct | List after TC-13 (5 rows) | Total 5, Pending 2, Completed 2, Overdue 1 (same as counting the rows) | Total 5, Pending 2, Completed 2, Overdue 1; matched the row count | Pass |
| TC-15 | M2 | Dashboard updates after edit and delete | Edit Maths deadline to 2026-10-13 (past); delete OS Assignment 2 (Pending, overdue) | After edit Overdue 1 → 2; after delete Total 5 → 4, Pending 2 → 1, Overdue 2 → 1 | After edit Overdue = 2; after delete Total 5 → 4, Pending 2 → 1, Overdue 2 → 1 | Pass |
| TC-16 | M2 | Deadline boundary values | Deadline = today (2026-10-15), tomorrow (2026-10-16), past (2026-10-12), all not Completed | Today: not overdue; tomorrow: not overdue; past: overdue | Today: no badge; tomorrow: no badge; past: Overdue badge | Pass |
| TC-17 | M1 | Deadline year longer than 4 digits | Type 12 / 20 / 20255 into the date box | Validation error; assignment not saved | **1st run:** saved as "20255-12-20" and shown as Overdue (bug TM-27). **Retest after fix:** "Please enter a valid deadline (the year must have 4 digits)." shown; nothing saved; Overdue = 0 | Fail → Pass (retest) |
| TC-18 | M1 | Maximum-length title with no spaces | Title = 100 × "A", Subject "Engineering Chemistry", Deadline 2026-11-01 | Title wraps; table stays inside the panel | **1st run:** table 1808 px wide on a 1280 px window, horizontal scrollbar (bug TM-28). **Retest after fix:** table right edge 1100 px ≤ panel 1120 px; no horizontal scroll | Fail → Pass (retest) |

**Summary:** 18 test cases executed. 16 passed on the first run. 2 failed on the first run (TC-17, TC-18), were logged as Jira bugs TM-27 and TM-28, fixed, and passed on retest. After the fixes, TC-01 to TC-16 were run again as a regression check and all passed.

## Unit tests (automated, `npm test`)

| ID | Function | Check | Result |
|---|---|---|---|
| UT-01 | validateAssignment | Valid details give no errors | Pass |
| UT-02 | validateAssignment | Empty or spaces-only title rejected | Pass |
| UT-03 | validateAssignment | Empty subject rejected | Pass |
| UT-04 | validateAssignment | Missing deadline rejected | Pass |
| UT-05 | validateAssignment | All three fields missing → 3 errors | Pass |
| UT-06 | isOverdue | Deadline yesterday, not completed → overdue | Pass |
| UT-07 | isOverdue | Deadline today → not overdue | Pass |
| UT-08 | isOverdue | Deadline tomorrow → not overdue | Pass |
| UT-09 | isOverdue | Completed with past deadline → not overdue | Pass |
| UT-10 | isOverdue | Month and year boundaries | Pass |
| UT-11 | getCounts | Counts for a 5-item sample | Pass |
| UT-12 | getCounts | Empty list → all zero | Pass |
| UT-13 | filterByStatus | Filter returns only matching statuses | Pass |
| UT-14 | validateAssignment | Year with more than 4 digits rejected (added for bug TM-27) | Pass |

First run (before bug TM-27 was found): 13/13 passed. Final run: 14/14 passed. The full console output is in `evidence/testing/unit_test_output.txt`.

## Testing techniques used

- **Functional testing:** TC-01, TC-05 to TC-07, TC-09 to TC-13
- **Unit testing:** UT-01 to UT-14
- **Integration testing:** TC-08, TC-14 and TC-15 check that the form, the saved data, the status dropdown, the filter and the cards work together
- **Boundary value analysis:** TC-16 (today, tomorrow and a past date), TC-17 (year length), TC-18 (maximum title length), UT-06 to UT-10
- **Equivalence partitioning:** valid details (TC-01) versus invalid classes: missing title (TC-02), missing subject (TC-03), missing deadline (TC-04) and malformed deadline (TC-17)
- **Validation testing:** TC-02 to TC-04, TC-17, UT-01 to UT-05 and UT-14
