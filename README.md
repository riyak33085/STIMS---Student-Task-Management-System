# STIMS — Student Task & Internship Management System (Front End)

Week 2 deliverable: a responsive, fully interactive front end for STIMS, the
system planned in Week 1. Students see their weekly internship tasks, check
status and evaluator feedback, and submit reports through a validated form.

## Views

| Route | View | Purpose |
|---|---|---|
| `#/` | Landing page | Explains STIMS and links into the dashboard |
| `#/dashboard` | Student dashboard | Weekly task cards, status badges, progress, and status filters |
| `#/task/:id` | Task detail / submission form | Task objective, evaluator feedback and score, and the submission form |

Navigation is connected throughout: the top bar links Home and Dashboard,
dashboard cards open task details, and task details link back to the dashboard.
Locked tasks are visible but not clickable.

## Run locally

No build step or dependencies are required.

**Option 1:** open `index.html` directly in a modern browser.

**Option 2 (recommended):** serve the folder:

```bash
cd stims-frontend
python3 -m http.server 8000
# then open http://localhost:8000
```

## Project structure

```
stims-frontend/
├── index.html        App shell: top bar, #app mount point, footer
├── css/style.css     Design tokens, layout, components, responsive rules
├── js/data.js        Mock data (tasks, statuses, student profile)
├── js/views.js       View modules: render() + mount() for each page
├── js/app.js         Hash router that renders and mounts the active view
└── README.md
```

## Development process

1. **Wireframes first.** The three screens follow the Week 1 wireframes
   (landing, dashboard, submission form).
2. **Data layer.** `data.js` holds mock tasks. Views read from it only through
   small helpers (`stimsFindTask`, `stimsProgressSummary`), so Week 3 can swap
   these for real API calls without rewriting the views.
3. **Views and router.** Each view is an object with `render(params)` returning
   HTML and `mount(params)` attaching listeners. `app.js` matches the URL hash
   and runs the right view.
4. **Styling.** CSS custom properties define the palette, and one stylesheet
   covers layout and components with a mobile breakpoint.
5. **Usability testing.** Simulated user interactions (filtering, invalid and
   valid form submission, navigation, mobile viewport) were run with Playwright
   and checked against screenshots.

## Design patterns and techniques

- **Module pattern** for views (`render` / `mount` separation).
- **Hash-based client-side routing** with no library.
- **Event delegation** for the dashboard filters.
- **Separation of data, view, and routing** across three files.
- **Status-driven UI:** one `status` field controls badge colour, card border,
  clickability, and form heading ("Submit" vs "Resubmit").

No external libraries or frameworks are used.

## Interactivity

- Dashboard filters: All weeks, Not submitted, Rejected, Approved.
- Live word counter on the description field (red below 200 words, green at 200+).
- Validation on submit: GitHub URL format (where required) and the 200-word minimum.
- Successful submit updates the task to "Submitted — Awaiting Review" and
  returns to the dashboard.

## Accessibility and responsiveness

- Semantic HTML (`header`, `nav`, `main`, `section`, `aside`, `form`, `label`).
- All inputs have visible labels; validation errors are shown as text.
- Colour is never the only status signal: every status also has a text label.
- Layout collapses to a single column below 860px.
- `prefers-reduced-motion` is respected.

## Known limitations

- Front end only: data is local mock data and resets on reload.
- File upload is UI-only; nothing is sent anywhere yet.
- Login is not implemented. A fixed student profile is shown.

## Next step (Week 3)

Build the REST API (`/api/tasks`, `/api/submissions`, auth) and replace the
mock data helpers with `fetch` calls.
