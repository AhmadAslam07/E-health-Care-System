import API from '../../../frontend/src/services/api';

export const loginDoctor = (data) => API.post('/auth/login', data);
export const registerDoctor = (data) => API.post('/auth/register', data);
