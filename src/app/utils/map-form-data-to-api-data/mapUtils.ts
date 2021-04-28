import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { AndreBarn } from 'app/pre-common/question-visibility/forms/barn/types';
import { ApiBarn } from '../../types/SoknadApiData';
import { Barn } from '../../types/SoknadFormData';

const barnFinnesIArray = (barnId: string, idArray: string[]): boolean => {
    return (idArray || []).find((id) => id === barnId) !== undefined;
};

export const mapAndreBarnToApiBarn = (annetBarn: AndreBarn, harAleneomsorgFor: string[]): ApiBarn => {
    return {
        navn: annetBarn.navn,
        aktørId: undefined,
        identitetsnummer: annetBarn.fnr,
        aleneomsorg: barnFinnesIArray(annetBarn.fnr, harAleneomsorgFor),
    };
};

export const mapBarnToApiBarn = (registrertBarn: Barn, harAleneomsorgFor: string[]): ApiBarn => {
    return {
        navn: formatName(registrertBarn.fornavn, registrertBarn.etternavn, registrertBarn.mellomnavn),
        aktørId: registrertBarn.aktørId,
        identitetsnummer: undefined,
        aleneomsorg: barnFinnesIArray(registrertBarn.aktørId, harAleneomsorgFor),
    };
};
