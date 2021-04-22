import { failure, RemoteData, success } from '@devexperts/remote-data-ts';
import { AxiosError } from 'axios';
import api from './api';
import { Barn } from '../types/SoknadFormData';
import { ApiEndpoint } from './api';

export type BarnRemoteData = RemoteData<AxiosError, Barn[]>;

interface BarnResultType {
    barnOppslag: Barn[];
}
const getBarnRemoteData = async (): Promise<BarnRemoteData> => {
    try {
        const { data } = await api.get<BarnResultType>(ApiEndpoint.barn);
        return Promise.resolve(success(data.barnOppslag));
    } catch (error) {
        return Promise.reject(failure(error));
    }
};

export default getBarnRemoteData;
