import { ApiBarn } from 'app/types/SoknadApiData';
import { Barn, SoknadFormData } from '../../types/SoknadFormData';
import { mapAnnetBarnToApiBarn, mapBarnToApiBarn } from './mapUtils';

export interface BarnApiData {
    barn: ApiBarn[];
}
export const barnFinnesIArray = (barnId: string, idArray: string[]): boolean => {
    return (idArray || []).find((id) => id === barnId) !== undefined;
};

export const mapBarnStepToApiData = (
    { annetBarn = [], harAleneomsorgFor, aleneomsorgTidspunkt }: SoknadFormData,
    registrerteBarn: Barn[]
): BarnApiData => {
    const registrerteBarnMedAleneomsorg = registrerteBarn.filter((b) => barnFinnesIArray(b.aktørId, harAleneomsorgFor));
    const annetBarnMedAleneomsorg = annetBarn.filter((b) => barnFinnesIArray(b.fnr, harAleneomsorgFor));

    const barn: ApiBarn[] = [
        ...annetBarnMedAleneomsorg.map((barn) => mapAnnetBarnToApiBarn(barn, aleneomsorgTidspunkt)),
        ...registrerteBarnMedAleneomsorg.map((barn) => mapBarnToApiBarn(barn, aleneomsorgTidspunkt)),
    ];

    // const barn: ApiBarn[] = registrerteBarnMedAleneomsorg.map((barn) => mapBarnToApiBarn(barn, aleneomsorgTidspunkt));
    return {
        barn: barn,
    };
};
