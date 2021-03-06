import { failure, RemoteData, success } from '@devexperts/remote-data-ts';
import { getApiUrl } from '../utils/apiUtils';
import { AxiosError } from 'axios';
import { Person } from '../types/Person';
import api, { ApiEndpoint } from './api';

export type SokerRemoteData = RemoteData<AxiosError, Person>;

const getSokerRemoteData = async (): Promise<SokerRemoteData> => {
    try {
        const { data } = await api.get<Person>(getApiUrl(ApiEndpoint.soker));
        return Promise.resolve(success(data));
    } catch (error) {
        return Promise.reject(failure(error));
    }
};

export default getSokerRemoteData;
