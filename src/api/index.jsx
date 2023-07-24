import axios from 'axios';
import { BACKEND_URL } from '../constants';

const API = axios.create({ baseURL: BACKEND_URL });
const TINT_API = axios.create({ baseURL: 'https://dh.fbk.eu/tint-demo-api/tint/' });

export const getModules = (userId) => API.get(`/api/modules/${userId}`);
export const getModule = (username, id) => API.get(`/api/modules/${username}/${id}`);
export const deleteModule = (id) => API.delete(`/api/modules/${id}`);
export const createModule = (newModule) => API.post('/api/modules', newModule);
export const updateModuleScore = (id, score, quizType) => API.patch(`/api/modules/${id}`, {score, quizType});

export const signIn = (formData) => API.post('/api/user/signin', formData);
export const signUp = (formData) => API.post('/api/user/signup', formData);
export const updatePassword = (formData) => API.patch('/api/user/updatepassword', formData);
export const getLemmas = (userId) => API.get(`/api/user/lemmas/${userId}`);
export const addLemmas = (userId, lemmas) => API.patch(`/api/user/lemmas/${userId}`, { lemmas });
export const getLemma = (userId, lemma) => API.get(`/api/user/lemma/${userId}/${lemma}`);

export const saveReview = (review) => API.post('/api/reviews', { review });

export const tintRequest = (text) => TINT_API.get(`/tint?text=${text}`);
