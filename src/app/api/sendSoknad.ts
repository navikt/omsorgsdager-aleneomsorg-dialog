import { getApiUrl } from '../utils/apiUtils';
import { SoknadApiData } from '../types/SoknadApiData';
import api, { ApiEndpoint } from './api';

export const sendSoknad = (data: SoknadApiData) => api.post(getApiUrl(ApiEndpoint.sendSoknad), data);
