import { ApiBarn } from 'app/types/SoknadApiData';
import { Barn, SoknadFormData } from '../../types/SoknadFormData';
import { mapBarnToApiBarn } from './mapUtils';

export interface BarnApiData {
    barn: ApiBarn[];
}
export const barnFinnesIArray = (barnId: string, idArray: string[]): boolean => {
    return (idArray || []).find((id) => id === barnId) !== undefined;
};

export const mapBarnStepToApiData = (
    { harAleneomsorgFor, aleneomsorgTidspunkt }: SoknadFormData,
    registrerteBarn: Barn[]
): BarnApiData => {
    const registrerteBarnMedAleneomsorg = registrerteBarn.filter((b) => barnFinnesIArray(b.aktørId, harAleneomsorgFor));

    const barn: ApiBarn[] = registrerteBarnMedAleneomsorg.map((barn) => mapBarnToApiBarn(barn, aleneomsorgTidspunkt));
    return {
        barn: barn,
    };
};
