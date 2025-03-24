import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://jobsync-ph.com/src/api',
});
//http://localhost:80/capstone-project/jobsync/
export default apiClient;
