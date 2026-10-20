/**
 * views.js
 * Each view exposes:
 *   - render(params) -> HTML string
 *   - mount(params)  -> wires up event listeners after the HTML is in the DOM
 * app.js calls render() then mount() for whichever view matches the route.
 */

const Views = {};

/* ---------------------------------------------------------------------- */
/*  LANDING                                                                 */
/* ---------------------------------------------------------------------- */

Views.landing = {
  render() {
    return `
      <section class="hero">
        <div class="hero-inner">
          <div class="hero-copy">
            <h1>Every internship task,<br />one place to submit it.</h1>
            <p class="hero-sub">
              STIMS replaces scattered email submissions with a single
              workspace: see this week's task, submit your report and
              GitHub link, and get evaluator feedback the moment it's in.
            </p>
            <div class="hero-actions">
              <a href="#/dashboard" class="btn btn-primary">Open Dashboard</a>
              <a href="#/task/week-1" class="btn btn-ghost">View a sample task</a>
            </div>
          </div>
          <div class="hero-panel" aria-hidden="true">
            <div class="hero-panel-row">
              <span class="hero-panel-label">Week</span>
              <span class="hero-panel-value">2 of 6</span>
            </div>
            <div class="hero-panel-track">
              <div class="hero-panel-fill" style="width: 33%"></div>
            </div>
            <ul class="hero-panel-list">
              <li><span class="dot dot-rejected"></span> Week 1 — Rejected, 24.6/100</li>
              <li><span class="dot dot-pending"></span> Week 2 — Not submitted</li>
              <li><span class="dot dot-locked"></span> Week 3 — Locked</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="features">
        <div class="features-inner">
          <article class="feature">
            <h3>Weekly task list</h3>
            <p>Objectives, deliverable type, and deadlines for every week of the program, in order.</p>
          </article>
          <article class="feature">
            <h3>One submission form</h3>
            <p>Upload your report, attach your GitHub link for technical tasks, and describe your work — all in one place.</p>
          </article>
          <article class="feature">
            <h3>Feedback you can act on</h3>
            <p>See your score and the evaluator's comments immediately, with a clear path to resubmit if needed.</p>
          </article>
        </div>
      </section>
    `;
  },
  mount() {
    // Static content only — no listeners required beyond the anchor links.
  },
};

/* ---------------------------------------------------------------------- */
/*  DASHBOARD                                                              */
/* ---------------------------------------------------------------------- */

Views.dashboard = {
  render() {
    const { total, approved } = stimsProgressSummary();
    const cards = STIMS_DATA.tasks.map(Views.dashboard._taskCard).join("");

    return `
      <section class="dashboard">
        <aside class="sidebar">
          <div class="sidebar-progress">
            <span class="sidebar-progress-label">Program progress</span>
            <span class="sidebar-progress-value">${approved} / ${total} approved</span>
          </div>
          <nav class="filter-list" id="filter-list">
            <button class="filter-btn is-active" data-filter="all">All weeks</button>
            <button class="filter-btn" data-filter="pending">Not submitted</button>
            <button class="filter-btn" data-filter="rejected">Rejected</button>
            <button class="filter-btn" data-filter="approved">Approved</button>
          </nav>
        </aside>

        <div class="task-grid" id="task-grid">
          ${cards}
        </div>
      </section>
    `;
  },

  _taskCard(task) {
    const statusLabel = STIMS_DATA.statusLabels[task.status];
    const scoreLine =
      task.score != null
        ? `<span class="task-card-score">${task.score}/100</span>`
        : "";
    const disabled = task.status === "locked" ? "task-card-locked" : "";
    return `
      <a
        class="task-card ${disabled}"
        data-status="${task.status}"
        href="${task.status === "locked" ? "#" : "#/task/" + task.id}"
      >
        <div class="task-card-top">
          <span class="task-card-week">Week ${task.week}</span>
          <span class="status-badge status-${task.status}">${statusLabel}</span>
        </div>
        <h3 class="task-card-title">${task.title}</h3>
        <div class="task-card-foot">
          <span class="task-card-type">${task.deliverableType}</span>
          ${scoreLine}
        </div>
      </a>
    `;
  },

  mount() {
    const filterList = document.getElementById("filter-list");
    const grid = document.getElementById("task-grid");
    if (!filterList || !grid) return;

    filterList.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;

      filterList
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      const filter = btn.dataset.filter;
      grid.querySelectorAll(".task-card").forEach((card) => {
        const status = card.dataset.status;
        const show =
          filter === "all" ||
          status === filter ||
          (filter === "pending" && status === "pending");
        card.style.display = show ? "" : "none";
      });
    });
  },
};

/* ---------------------------------------------------------------------- */
/*  TASK DETAIL / SUBMISSION FORM                                          */
/* ---------------------------------------------------------------------- */

Views.task = {
  render(params) {
    const task = stimsFindTask(params.id);
    if (!task) {
      return `<section class="empty-state"><h2>Task not found</h2><p><a href="#/dashboard">Back to dashboard</a></p></section>`;
    }

    const feedbackBlock = task.feedback
      ? `
        <div class="feedback-panel feedback-${task.status}">
          <h3>Evaluator feedback</h3>
          <p>${task.feedback}</p>
          ${task.score != null ? `<p class="feedback-score">Score: ${task.score} / 100 (minimum ${task.minScore} required)</p>` : ""}
        </div>`
      : "";

    return `
      <section class="task-detail">
        <a href="#/dashboard" class="back-link">&larr; Back to dashboard</a>

        <header class="task-detail-head">
          <span class="task-card-week">Week ${task.week}</span>
          <h1>${task.title}</h1>
          <p class="task-detail-objective">${task.objective}</p>
          <span class="status-badge status-${task.status}">${STIMS_DATA.statusLabels[task.status]}</span>
        </header>

        ${feedbackBlock}

        <form class="submission-form" id="submission-form" novalidate>
          <h2>${task.status === "rejected" ? "Resubmit your work" : "Submit your work"}</h2>

          <label class="field">
            <span class="field-label">Report file <span class="field-hint">(${task.deliverableType})</span></span>
            <input type="file" name="report" />
          </label>

          ${
            task.githubRequired
              ? `
          <label class="field">
            <span class="field-label">GitHub project URL <span class="field-hint">(required for this task)</span></span>
            <input type="url" name="github" id="github-input" placeholder="https://github.com/username/project" />
            <span class="field-error" id="github-error"></span>
          </label>`
              : ""
          }

          <label class="field">
            <span class="field-label">Description of your submission <span class="field-hint">(minimum 200 words)</span></span>
            <textarea name="description" id="description-input" rows="7" placeholder="Explain what you built, the decisions you made, and how to run it locally."></textarea>
            <span class="word-count" id="word-count">0 words</span>
          </label>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" id="submit-btn">Submit for review</button>
            <span class="form-status" id="form-status"></span>
          </div>
        </form>
      </section>
    `;
  },

  mount(params) {
    const task = stimsFindTask(params.id);
    const form = document.getElementById("submission-form");
    if (!task || !form) return;

    const description = document.getElementById("description-input");
    const wordCount = document.getElementById("word-count");
    const githubInput = document.getElementById("github-input");
    const githubError = document.getElementById("github-error");
    const formStatus = document.getElementById("form-status");

    const countWords = (text) =>
      text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;

    if (description) {
      description.addEventListener("input", () => {
        const n = countWords(description.value);
        wordCount.textContent = `${n} word${n === 1 ? "" : "s"}`;
        wordCount.classList.toggle("word-count-ok", n >= 200);
        wordCount.classList.toggle("word-count-low", n < 200);
      });
    }

    const isValidGithubUrl = (value) =>
      /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(value.trim());

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;

      if (task.githubRequired) {
        if (!isValidGithubUrl(githubInput.value)) {
          githubError.textContent =
            "Enter a valid GitHub URL, e.g. https://github.com/username/project";
          githubInput.classList.add("field-invalid");
          valid = false;
        } else {
          githubError.textContent = "";
          githubInput.classList.remove("field-invalid");
        }
      }

      const n = countWords(description.value);
      if (n < 200) {
        wordCount.classList.add("word-count-low");
        valid = false;
      }

      if (!valid) {
        formStatus.textContent = "Please fix the highlighted fields before submitting.";
        formStatus.classList.add("form-status-error");
        return;
      }

      // Mock submission: in Week 3+ this becomes a POST /api/submissions call.
      task.status = "submitted";
      task.feedback = null;
      task.score = null;
      formStatus.classList.remove("form-status-error");
      formStatus.textContent = "Submitted! Redirecting to your dashboard…";
      setTimeout(() => {
        window.location.hash = "#/dashboard";
      }, 900);
    });
  },
};
