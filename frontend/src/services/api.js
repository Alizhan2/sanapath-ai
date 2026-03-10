/**
 * API Service for SanaPath AI
 * Handles all backend communication with error handling
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Custom API Error class
export class ApiError extends Error {
  constructor(message, status, errorCode) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errorCode = errorCode;
  }
}

// Helper function for API calls with better error handling
async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { detail: await response.text() };
    }

    if (!response.ok) {
      // Handle specific error codes
      if (response.status === 401) {
        // Clear invalid token
        localStorage.removeItem('token');
        throw new ApiError(
          data.message || 'Session expired. Please login again.',
          401,
          data.error_code || 'AUTH_ERROR'
        );
      }

      // Improved handling for FastAPI validation errors (status 422)
      let errorMessage = data.message || `Request failed with status ${response.status}`;
      
      if (data.detail) {
        if (Array.isArray(data.detail)) {
          // If FastAPI returned a list of validation errors
          errorMessage = data.detail.map(err => `${err.loc?.join('.') || 'Field'}: ${err.msg}`).join(', ');
        } else if (typeof data.detail === 'string') {
          // If it's a simple error string
          errorMessage = data.detail;
        }
      }

      throw new ApiError(
        errorMessage,
        response.status,
        data.error_code || 'API_ERROR'
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // AbortController timeout
    if (error.name === 'AbortError') {
      throw new ApiError(
        'Request timed out. The server took too long to respond.',
        408,
        'TIMEOUT_ERROR'
      );
    }

    // Network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new ApiError(
        'Unable to connect to server. Please check your internet connection.',
        0,
        'NETWORK_ERROR'
      );
    }

    throw new ApiError(
      error.message || 'An unexpected error occurred',
      500,
      'UNKNOWN_ERROR'
    );
  }
}

// Auth API
export const authAPI = {
  login: (email, password) => apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),

  register: (data) => apiCall('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  firebaseAuth: (data) => apiCall('/api/auth/firebase/verify', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  demoLogin: (email, name) => apiCall('/api/auth/demo/login', {
    method: 'POST',
    body: JSON.stringify({ email, name }),
  }),

  getMe: () => apiCall('/api/auth/me'),

  logout: () => apiCall('/api/auth/logout', { method: 'POST' }),
};

// Survey API
export const surveyAPI = {
  submitSurvey: (data) => apiCall('/api/survey/submit', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getQuestions: () => apiCall('/api/survey/questions'),

  getRecommendations: () => apiCall('/api/survey/questions'),
};

// Projects API
export const projectsAPI = {
  generateProject: (prompt, signal) => apiCall('/api/projects/generate', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
    signal,
  }),

  startProject: (projectData) => apiCall('/api/projects/start', {
    method: 'POST',
    body: JSON.stringify(projectData),
  }),

  getMyProjects: (status) => {
    const params = status ? `?status_filter=${status}` : '';
    return apiCall(`/api/projects/my-projects${params}`);
  },

  getProject: (uuid) => apiCall(`/api/projects/${uuid}`),

  updateProject: (uuid, data) => apiCall(`/api/projects/${uuid}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  deleteProject: (uuid) => apiCall(`/api/projects/${uuid}`, {
    method: 'DELETE',
  }),

  completeTask: (uuid, taskId) => apiCall(`/api/projects/${uuid}/complete-task?task_id=${encodeURIComponent(taskId)}`, {
    method: 'POST',
  }),
};

// Community API
export const communityAPI = {
  getProjects: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.perPage) searchParams.set('per_page', params.perPage.toString());
    if (params.difficulty) searchParams.set('difficulty', params.difficulty);
    if (params.techStack) searchParams.set('tech_stack', params.techStack);
    if (params.search) searchParams.set('search', params.search);
    if (params.lookingForCollaborators !== undefined) {
      searchParams.set('looking_for_collaborators', params.lookingForCollaborators.toString());
    }
    return apiCall(`/api/community/projects?${searchParams}`);
  },

  getProject: (uuid) => apiCall(`/api/community/projects/${uuid}`),

  publishProject: (data) => apiCall('/api/community/publish', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  joinProject: (uuid) => apiCall(`/api/community/projects/${uuid}/join`, {
    method: 'POST',
  }),

  leaveProject: (uuid) => apiCall(`/api/community/projects/${uuid}/leave`, {
    method: 'POST',
  }),

  generateLinkedInPost: (data) => apiCall('/api/community/linkedin-post', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// AI API
export const aiAPI = {
  chat: (message, context = '') => apiCall('/api/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ message, context }),
  }),
};

// Users API
export const usersAPI = {
  getProfile: (userId) => apiCall(`/api/users/profile/${userId}`),

  updateProfile: (userId, data) => apiCall(`/api/users/profile/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  getStats: (userId) => apiCall(`/api/users/stats/${userId}`),

  updateStats: (userId, stats) => apiCall(`/api/users/stats/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(stats),
  }),

  addXP: (userId, amount) => apiCall(`/api/users/stats/${userId}/add-xp?xp_amount=${amount}`, {
    method: 'POST',
  }),

  getAchievements: (userId) => apiCall(`/api/users/achievements/${userId}`),

  unlockAchievement: (userId, achievementId) => apiCall(`/api/users/achievements/${userId}/unlock/${achievementId}`, {
    method: 'POST',
  }),

  logActivity: (userId, activityType) => apiCall(`/api/users/activity/${userId}?activity_type=${activityType}`, {
    method: 'POST',
  }),

  getLeaderboard: (limit = 10) => apiCall(`/api/users/leaderboard?limit=${limit}`),

  getSettings: (userId) => apiCall(`/api/users/settings/${userId}`),

  updateSettings: (userId, settings) => apiCall(`/api/users/settings/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(settings),
  }),
};

// Health check
export const healthCheck = () => apiCall('/health');

export default {
  auth: authAPI,
  survey: surveyAPI,
  projects: projectsAPI,
  community: communityAPI,
  ai: aiAPI,
  users: usersAPI,
  healthCheck,
  ApiError,
};
