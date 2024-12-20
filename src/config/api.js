export default {
  BASE_URL: process.env.NODE_ENV === 'production'
    ? 'https://api.singerjob.com/v1'
    : 'http://localhost:3000/api/v1',
  
  TIMEOUT: 10000,
  
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    OPPORTUNITIES: '/opportunities',
    PROFILE: '/profile',
    UPLOAD: '/upload'
  }
};