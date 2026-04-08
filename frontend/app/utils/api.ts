import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Implement interceptors if we need to pass Clerk tokens to the backend
apiClient.interceptors.request.use(
  async (config) => {
    // You could dynamically get the Clerk token here and inject it
    // const token = await window.Clerk?.session?.getToken();
    // if (token) { config.headers.Authorization = `Bearer ${token}`; }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Fallback Mock Data Simulation if Real Backend is offline
    console.warn("API Error caught. Falling back to mock data for layout viewing:", error.config?.url);
    
    let mockData: any = null;
    const url = error.config?.url;

    if (url?.includes('/internships')) {
      mockData = [
        { id: '1', company: 'Fintech Hub', role: 'Frontend Developer Intern', stipend: '₹20,000/mo', duration: '3 Months', type: 'Remote', tags: ['React', 'TypeScript'] },
        { id: '2', company: 'DataSys AI', role: 'Data Science Intern', stipend: '₹25,000/mo', duration: '6 Months', type: 'On-site (Bangalore)', tags: ['Python', 'Machine Learning'] }
      ];
    } else if (url?.includes('/experiences')) {
      mockData = [
        { id: '1', company: 'Google', role: 'Software Engineer', author: 'Alice', content: 'The first round was focused on basic data structures...', upvotes: 142, comments: 24, time: '2 hours ago' }
      ];
    } else if (url?.includes('/faqs')) {
      mockData = [
        { category: 'Placement Policies', items: [ { q: 'What is the eligibility criteria?', a: 'Students must have a minimum CGPA of 7.0...' } ] }
      ];
    } else if (url?.includes('/announcements')) {
      mockData = [
        { id: '1', title: 'TCS Registration Deadline', date: 'Oct 15', content: 'Ensure all profiles are updated before tomorrow.' }
      ];
    } else if (url?.includes('/users/me/stats')) {
      mockData = { cgpa: '8.5', appliedRoles: 12, interviews: 3 };
    } else if (url?.includes('/companies/')) {
      mockData = { id: 'c1', name: 'Google', description: 'Tech giant.', website: 'google.com', industry: 'Software', rolesAimed: ['SDE', 'Cloud'], recentPlacements: 15 };
    } else if (url?.includes('/admin/stats')) {
      mockData = { activeInternships: 15, totalStudents: 600, newExperiences: 12 };
    } else if (url?.includes('/admin/companies') || url?.includes('/admin/faqs') || url?.includes('/admin/internships')) {
      mockData = []; // Blank lists for admin lists works fine for visualization
    }

    if (mockData) {
      return Promise.resolve({ data: mockData, status: 200 });
    }

    return Promise.reject(error);
  }
);
