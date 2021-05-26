import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { Barn } from '../types/SoknadFormData';
import { AndreBarn } from '../pre-common/question-visibility/forms/barn';

export interface BarnMedAleneomsorg {
    idFnr: string;
    navn: string;
}

export const barnFinnesIkkeIArray = (barnId: string, idArray: string[]): boolean => {
    return (idArray || []).find((id) => id === barnId) !== undefined;
};

export const barnFinnesIkkeIArray1 = (barnId: string, idArray: string[]): boolean => {
    return (idArray || []).find((id) => id === barnId) === undefined;
};

export const mapAndreBarnToBarnMedAleneomsorg = (andreBarn: AndreBarn): BarnMedAleneomsorg => {
    return {
        idFnr: andreBarn.fnr,
        navn: andreBarn.navn,
    };
};

export const mapRegistrerteBarnToBarnMedAleneomsorg = (registrertBarn: Barn): BarnMedAleneomsorg => {
    return {
        idFnr: registrertBarn.aktørId,
        navn: formatName(registrertBarn.fornavn, registrertBarn.etternavn, registrertBarn.mellomnavn),
    };
};
