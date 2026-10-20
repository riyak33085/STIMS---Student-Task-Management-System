/**
 * data.js
 * In-memory mock data for the STIMS front end.
 * In Week 3 this will be replaced by calls to the real REST API
 * (GET /api/tasks, GET/POST /api/submissions, etc.) — every place
 * that reads STIMS_DATA below is written so that swap is a drop-in
 * change rather than a rewrite of the views.
 */

const STIMS_DATA = {
  student: {
    name: "Priya Sharma",
    role: "Student",
    cohort: "Full Stack — Batch 14",
  },

  tasks: [
    {
      id: "week-1",
      week: 1,
      title: "Project Planning & System Architecture",
      objective:
        "Conceptualize a full stack application, define requirements, and produce flowcharts, wireframes, a technical architecture diagram, and a database schema.",
      deliverableType: "Word document (.docx)",
      githubRequired: false,
      status: "rejected",
      score: 24.6,
      minScore: 30,
      feedback:
        "Report lacks flowcharts, wireframes, technical architecture diagrams, and detailed database design. Resubmit with complete sections.",
    },
    {
      id: "week-2",
      week: 2,
      title: "Front-End Application Development",
      objective:
        "Build a responsive front end with at least three interconnected views: a landing page, a dashboard, and a detail view.",
      deliverableType: "Source code (.zip) + README",
      githubRequired: true,
      status: "pending",
      score: null,
      minScore: 30,
      feedback: null,
    },
    {
      id: "week-3",
      week: 3,
      title: "Back-End API Development",
      objective:
        "Build RESTful APIs with CRUD operations, authentication, and a connected database.",
      deliverableType: "Source code (.zip) + API docs",
      githubRequired: true,
      status: "locked",
      score: null,
      minScore: 30,
      feedback: null,
    },
    {
      id: "week-4",
      week: 4,
      title: "Integrating Front-End with Back-End",
      objective:
        "Connect the front end to the back-end APIs for dynamic, real-time interaction.",
      deliverableType: "Source code (.zip) + demo video",
      githubRequired: true,
      status: "locked",
      score: null,
      minScore: 30,
      feedback: null,
    },
    {
      id: "week-5",
      week: 5,
      title: "Testing, Debugging & Optimization",
      objective:
        "Write and run test suites for the front end and back end, and document optimizations made.",
      deliverableType: "Source code (.zip) + test report",
      githubRequired: true,
      status: "locked",
      score: null,
      minScore: 30,
      feedback: null,
    },
    {
      id: "week-6",
      week: 6,
      title: "Deployment, Maintenance & Reflection",
      objective:
        "Deploy the application publicly and submit a deployment guide, maintenance plan, and reflection report.",
      deliverableType: "Source code (.zip) + reflection report",
      githubRequired: true,
      status: "locked",
      score: null,
      minScore: 30,
      feedback: null,
    },
  ],

  statusLabels: {
    locked: "Locked",
    pending: "Not Submitted",
    submitted: "Submitted — Awaiting Review",
    rejected: "Rejected",
    approved: "Approved",
  },
};

/** Looks up a task by id; returns undefined if not found. */
function stimsFindTask(taskId) {
  return STIMS_DATA.tasks.find((t) => t.id === taskId);
}

/** Simple derived stat used on the dashboard header. */
function stimsProgressSummary() {
  const total = STIMS_DATA.tasks.length;
  const approved = STIMS_DATA.tasks.filter((t) => t.status === "approved").length;
  return { total, approved };
}
