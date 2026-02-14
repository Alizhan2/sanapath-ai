import { useState, useEffect, useCallback } from 'react';
import { recordActivity } from './useRealStats';

/**
 * Default roadmap data — used as initial seed when no data exists in localStorage.
 * Once initialized, all mutations happen in localStorage (single source of truth).
 */
const DEFAULT_ROADMAP = [
  {
    id: 1, step: 1,
    title: 'Foundations: Python & Git',
    goal: 'Master Python core + Git workflow to confidently contribute to team projects and open source.',
    skills: ['Python 3.x', 'Git & GitHub', 'CLI basics', 'Virtual environments'],
    projects: [
      { name: 'CLI Task Manager', desc: 'Build a command-line todo app with file persistence' },
      { name: 'GitHub Portfolio Setup', desc: 'Create a professional profile with pinned repos' },
    ],
    duration: '3-4 weeks',
    tasks: [],
  },
  {
    id: 2, step: 2,
    title: 'Backend Development with FastAPI',
    goal: 'Build production-quality REST APIs. Understand databases, auth, testing, and deployment.',
    skills: ['FastAPI', 'SQLAlchemy', 'PostgreSQL', 'JWT Auth', 'Pytest', 'Docker basics'],
    projects: [
      { name: 'CRUD API + PostgreSQL', desc: 'Full REST API with user auth and database' },
      { name: 'API Testing Suite', desc: 'Write comprehensive tests for all endpoints' },
      { name: 'README Excellence', desc: 'Create portfolio-worthy documentation' },
    ],
    duration: '5-6 weeks',
    tasks: [
      { id: 't1', title: 'Build a CRUD API with FastAPI and PostgreSQL', tags: ['Backend', 'Project', 'GitHub'], due: '2026-02-20', status: 'in-progress', description: 'Create a complete REST API using FastAPI with SQLAlchemy ORM and PostgreSQL.', checklist: ['Set up FastAPI project', 'Create SQLAlchemy models', 'Implement CRUD endpoints', 'Add authentication', 'Write API documentation'], estimated: '8 hours' },
      { id: 't2', title: 'Write unit tests for your main project', tags: ['Testing', 'Backend'], due: '2026-02-22', status: 'todo', description: 'Add comprehensive test coverage using pytest.', checklist: ['Install pytest & httpx', 'Test GET endpoints', 'Test POST/PUT/DELETE', 'Test error cases', 'Achieve 80%+ coverage'], estimated: '5 hours' },
      { id: 't3', title: 'Improve README for fastapi-todo repo', tags: ['GitHub', 'Portfolio'], due: '2026-02-18', status: 'done', description: 'Create a professional README with project description, screenshots, and docs.', checklist: ['Add project overview', 'Add installation steps', 'Include API examples', 'Add screenshots', 'Add badges'], estimated: '2 hours' },
      { id: 't4', title: 'Optimize LinkedIn headline for backend roles', tags: ['LinkedIn', 'Career'], due: '2026-02-19', status: 'in-progress', description: 'Update your LinkedIn headline with keywords recruiters search for.', checklist: ['Research top headlines', 'Draft 3 options', 'Get feedback', 'Update headline', 'Update summary'], estimated: '1 hour' },
    ],
  },
  {
    id: 3, step: 3,
    title: 'DevOps & Deployment',
    goal: 'Deploy your apps professionally. Learn CI/CD, Docker, and cloud basics.',
    skills: ['Docker', 'CI/CD', 'Render/Railway', 'GitHub Actions', 'Environment management'],
    projects: [
      { name: 'Containerize Your API', desc: 'Dockerize FastAPI app with docker-compose' },
      { name: 'Auto-Deploy Pipeline', desc: 'Set up GitHub Actions for automated testing & deployment' },
    ],
    duration: '3-4 weeks',
    tasks: [
      { id: 't5', title: 'Deploy API to Render with CI/CD', tags: ['DevOps', 'Backend'], due: '2026-02-25', status: 'todo', description: 'Set up automatic deployment pipeline from GitHub to Render.', checklist: ['Create Render account', 'Configure deployment', 'Set environment variables', 'Add health endpoint', 'Test auto-deploy'], estimated: '3 hours' },
      { id: 't6', title: 'Learn Docker basics and containerize your app', tags: ['DevOps', 'Project'], due: '2026-02-28', status: 'todo', description: 'Create a Dockerfile for your FastAPI app, learn docker-compose.', checklist: ['Install Docker Desktop', 'Write Dockerfile', 'Create docker-compose.yml', 'Add PostgreSQL container', 'Test locally'], estimated: '6 hours' },
    ],
  },
  {
    id: 4, step: 4,
    title: 'ML & AI Integration',
    goal: 'Integrate machine learning into your backend. Build intelligent features.',
    skills: ['scikit-learn', 'Pandas', 'ML APIs', 'Model serving', 'Data pipelines'],
    projects: [
      { name: 'Recommendation Engine', desc: 'Build a simple content recommendation API' },
      { name: 'AI-Powered Feature', desc: 'Add smart features to your existing project' },
    ],
    duration: '4-5 weeks',
    tasks: [],
  },
  {
    id: 5, step: 5,
    title: 'Portfolio & Job Readiness',
    goal: 'Polish everything. Build a standout portfolio, optimize LinkedIn, and start applying.',
    skills: ['Portfolio design', 'LinkedIn optimization', 'Interview prep', 'System design basics'],
    projects: [
      { name: 'Portfolio Website', desc: 'Showcase your best projects with live demos' },
      { name: 'Open Source Contribution', desc: 'Make a meaningful PR to a popular project' },
    ],
    duration: '3-4 weeks',
    tasks: [],
  },
];

const STORAGE_KEY = 'sanapath_roadmap';

function loadRoadmap() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // First time — seed with defaults
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ROADMAP));
  return DEFAULT_ROADMAP;
}

function saveRoadmap(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event('roadmapUpdated'));
  window.dispatchEvent(new Event('statsUpdated'));
}

/**
 * Compute step status and progress from its tasks
 */
function computeStepMeta(step, stepIndex, steps) {
  const tasks = step.tasks || [];
  if (tasks.length === 0) {
    // Steps with no tasks: check if previous steps are all complete
    const prevAllComplete = steps.slice(0, stepIndex).every(s => {
      const t = s.tasks || [];
      return t.length === 0 ? s._status === 'completed' : t.every(tk => tk.status === 'done');
    });
    // If step 1 has no tasks, mark as completed by default (foundations)
    if (stepIndex === 0) return { status: 'completed', progress: 100 };
    if (prevAllComplete) return { status: 'upcoming', progress: 0 };
    return { status: 'locked', progress: 0 };
  }

  const doneCount = tasks.filter(t => t.status === 'done').length;
  const progress = Math.round((doneCount / tasks.length) * 100);

  if (doneCount === tasks.length) return { status: 'completed', progress: 100 };
  if (doneCount > 0 || tasks.some(t => t.status === 'in-progress')) return { status: 'in-progress', progress };

  // Check if previous steps are done to determine upcoming vs locked
  const prevAllComplete = steps.slice(0, stepIndex).every(s => {
    const t = s.tasks || [];
    if (t.length === 0) return true; // No-task steps assumed done if they come first
    return t.every(tk => tk.status === 'done');
  });

  return { status: prevAllComplete ? 'upcoming' : 'locked', progress };
}

/**
 * Single source of truth hook for roadmap + tasks data.
 * Used by Dashboard, Tasks, RoadmapDetail, and SkillsMap.
 */
export const useRoadmapData = () => {
  const [roadmap, setRoadmap] = useState(() => loadRoadmap());

  // Re-sync when other tabs/components update
  useEffect(() => {
    const sync = () => setRoadmap(loadRoadmap());
    window.addEventListener('storage', sync);
    window.addEventListener('roadmapUpdated', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('roadmapUpdated', sync);
    };
  }, []);

  // --- Computed values ---

  // Steps with computed status & progress
  const steps = roadmap.map((step, i, arr) => {
    const meta = computeStepMeta(step, i, arr);
    return { ...step, _status: meta.status, _progress: meta.progress };
  });

  // All tasks flat list
  const allTasks = roadmap.flatMap((step) =>
    (step.tasks || []).map(t => ({ ...t, step: step.step }))
  );

  // Overall progress
  const totalTasks = allTasks.length;
  const doneTasks = allTasks.filter(t => t.status === 'done').length;
  const overallProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // Current step (first in-progress or upcoming)
  const currentStep = steps.find(s => s._status === 'in-progress') || steps.find(s => s._status === 'upcoming') || steps[0];

  // This week's tasks (from current step, limited to tasks due within 7 days or all current step tasks)
  const now = Date.now();
  const weekTasks = allTasks.filter(t => {
    const dueDate = new Date(t.due).getTime();
    return dueDate <= now + 7 * 86400000 || t.step === currentStep?.step;
  }).slice(0, 6);

  // --- Mutations ---

  const toggleTaskStatus = useCallback((taskId) => {
    const updated = roadmap.map(step => ({
      ...step,
      tasks: (step.tasks || []).map(t => {
        if (t.id !== taskId) return t;
        const newStatus = t.status === 'done' ? 'todo' : 'done';
        // Record activity when marking done
        if (newStatus === 'done') {
          recordActivity(1);
          // Emit event for toast notifications
          window.dispatchEvent(new CustomEvent('taskCompleted', { detail: { title: t.title } }));
        }
        return { ...t, status: newStatus };
      }),
    }));
    setRoadmap(updated);
    saveRoadmap(updated);
  }, [roadmap]);

  const updateTaskStatus = useCallback((taskId, newStatus) => {
    const updated = roadmap.map(step => ({
      ...step,
      tasks: (step.tasks || []).map(t => {
        if (t.id !== taskId) return t;
        if (newStatus === 'done' && t.status !== 'done') {
          recordActivity(1);
          window.dispatchEvent(new CustomEvent('taskCompleted', { detail: { title: t.title } }));
        }
        return { ...t, status: newStatus };
      }),
    }));
    setRoadmap(updated);
    saveRoadmap(updated);
  }, [roadmap]);

  return {
    roadmap,
    steps,
    allTasks,
    weekTasks,
    totalTasks,
    doneTasks,
    overallProgress,
    currentStep,
    toggleTaskStatus,
    updateTaskStatus,
  };
};
