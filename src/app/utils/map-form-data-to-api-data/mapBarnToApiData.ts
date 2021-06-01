import { ApiBarn } from 'app/types/SoknadApiData';
import { Barn, SoknadFormData } from '../../types/SoknadFormData';
import { mapAndreBarnToApiBarn, mapBarnToApiBarn } from './mapUtils';

export interface BarnApiData {
    barn: ApiBarn[];
}
export const barnFinnesIArray = (barnId: string, idArray: string[]): boolean => {
    return (idArray || []).find((id) => id === barnId) !== undefined;
};

export const mapBarnStepToApiData = (
    { andreBarn, harAleneomsorgFor, aleneomsorgTidspunkt }: SoknadFormData,
    registrerteBarn: Barn[]
): BarnApiData => {
    const andreBarnMedAleneomsorg = andreBarn.filter((b) => barnFinnesIArray(b.fnr, harAleneomsorgFor));
    const registrerteBarnMedAleneomsorg = registrerteBarn.filter((b) => barnFinnesIArray(b.aktørId, harAleneomsorgFor));

    const barn: ApiBarn[] = [
        ...andreBarnMedAleneomsorg.map((barn) => mapAndreBarnToApiBarn(barn, aleneomsorgTidspunkt)),
        ...registrerteBarnMedAleneomsorg.map((barn) => mapBarnToApiBarn(barn, aleneomsorgTidspunkt)),
    ];
    return {
        barn: barn,
    };
};
