import { ApiBarn } from 'app/types/SoknadApiData';
import { Barn, SoknadFormData } from '../../types/SoknadFormData';
import { mapAndreBarnToApiBarn, mapBarnToApiBarn } from './mapUtils';

export interface BarnApiData {
    barn: ApiBarn[];
}

export const mapBarnStepToApiData = (
    { andreBarn, harAleneomsorgFor }: SoknadFormData,
    registrerteBarn: Barn[]
): BarnApiData => {
    const barn: ApiBarn[] = [
        ...andreBarn.map((barn) => mapAndreBarnToApiBarn(barn, harAleneomsorgFor)),
        ...registrerteBarn.map((barn) => mapBarnToApiBarn(barn, harAleneomsorgFor)),
    ];
    return {
        barn: barn,
    };
};
