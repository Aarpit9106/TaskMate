# TaskMate — Student Task and Assignment Management System

A small single-page web app for students to record assignments, track their status, see overdue work and view a summary dashboard.
Built for the Software Engineering Lab Project-Based Learning (PBL).

## Objectives

- Record assignments with a title, subject, deadline and optional description.
- Track each assignment as **Pending**, **In Progress** or **Completed**.
- Highlight overdue assignments automatically.
- Show summary counts on a dashboard.
- Keep the data after the browser is refreshed (LocalStorage).

## Implemented modules

**Module 1 – Assignment Management**
Add, view, edit and delete assignments. Required-field validation (title, subject and deadline). Data is saved in the browser's LocalStorage.

**Module 2 – Task Tracking and Dashboard**
Change the status from a dropdown in each row and filter the list by status (All, Pending, In Progress, Completed). Overdue assignments get a red **Overdue** badge. Four summary cards show Total, Pending, Completed and Overdue, and they update after every change.

An assignment is **overdue** when its deadline is before today **and** its status is not Completed. An assignment due today is not overdue. A Completed assignment is never overdue.
The **Pending** card counts assignments whose status is exactly "Pending", so Total = Pending + In Progress + Completed.

## Technologies

React 18, Vite 6, JavaScript, CSS and the browser's LocalStorage.
There is no backend, database or login. Unit tests use the test runner that comes with Node.js, so no extra test library is needed.

## Folder structure

```text
TaskMate/
├── package.json            project info and npm scripts
├── vite.config.js          Vite setup (React plugin)
├── index.html              page that loads the app
├── README.md
├── src/
│   ├── main.jsx            starts React
│   ├── App.jsx             the whole user interface (both modules)
│   ├── App.css             styles
│   └── taskUtils.js        validation, overdue check, counts, filter, LocalStorage
└── tests/
    ├── taskUtils.test.js   automated unit tests (npm test)
    └── test-cases.md       test cases and results
```

Screenshots, Jira evidence and the PBL project report are submitted separately and are not part of this repository.

## How to run on Windows

You need Node.js version 18 or newer. Check your version with `node -v`.

1. Unzip or copy the `TaskMate` folder, for example to `C:\Projects\TaskMate`.
2. Open the folder in VS Code (**File → Open Folder…**).
3. Open a terminal (**Terminal → New Terminal**) and run:

```bash
npm install
npm run dev
```

4. Open the link shown in the terminal, usually **http://localhost:5173/**, in Chrome or Edge.
5. To stop the app, click in the terminal and press **Ctrl + C**.

`npm install` is needed only the first time, or after `node_modules` has been deleted.

## How to use

1. Fill in **Assignment Title**, **Subject** and **Deadline**. The description is optional. Then click **Add Assignment**.
2. The assignment appears in **My Assignments** with status *Pending*.
3. Change the status with the dropdown in the row.
4. Use **Filter by status** to show only Pending, In Progress or Completed work.
5. Click **Edit** to load an assignment into the form, change it and click **Save Changes**. Click **Cancel** to discard your changes.
6. Click **Delete** and confirm to remove an assignment.
7. Past-deadline work that is not completed shows a red **Overdue** badge. The cards at the top update automatically.
8. Refresh the page: your data is still there.

## Running the unit tests

```bash
npm test
```

This runs 14 unit tests from `tests/taskUtils.test.js` with Node's built-in test runner. They check validation, overdue logic, dashboard counts and filtering.
The user-interface test cases (TC-01 to TC-18) and their results are listed in `tests/test-cases.md`.


## Known limitations

- Data is stored only in the current browser (LocalStorage). It is not shared between browsers or devices, and it is lost if the browser data is cleared.
- There is no login, backend or database. It is a single-user, local app.
- The "today" date comes from the computer's clock. If the app is left open past midnight, refresh it to update the overdue markings.
- There are no reminders or notifications.
