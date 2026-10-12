import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const getHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const getHazards = async () => {
  const response = await api.get('/hazards');
  return response.data;
};

export const getGlobalRiskGrid = async (hazard = 'multi') => {
  const response = await api.get(`/risk?hazard=${hazard}`);
  return response.data;
};

export const getRegionRisk = async (regionId, hazard = 'multi') => {
  const response = await api.get(`/risk/region/${regionId}?hazard=${hazard}`);
  return response.data;
};

export const getPointRisk = async (lat, lng, hazard = 'multi') => {
  const response = await api.get(`/risk/point?lat=${lat}&lng=${lng}&hazard=${hazard}`);
  return response.data;
};

export const getEnvironment = async (regionId, live = false) => {
  const response = await api.get(`/environment?region_id=${regionId}&live=${live}`);
  return response.data;
};

export const sendAiMessage = async (message, selectedHazard, selectedRegionId, context) => {
  const response = await api.post('/ai/chat', {
    message,
    selected_hazard: selectedHazard,
    selected_region_id: selectedRegionId,
    context
  });
  return response.data;
};

export const getDataStatus = async () => {
  const response = await api.get('/data-status');
  return response.data;
};

export const getModelMetrics = async () => {
  const response = await api.get('/model-metrics');
  return response.data;
};
