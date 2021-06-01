import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { Barn } from '../types/SoknadFormData';
import { AndreBarn } from '../pre-common/forms/barn';
import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';

export interface BarnMedAleneomsorg {
    idFnr: string;
    navn: string;
}

export const barnFinnesIArray = (barnId: string, idArray: string[]): boolean => {
    return (idArray || []).find((id) => id === barnId) !== undefined;
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

export const getYear = (yearsToSubtract: number): string => (dayjs().year() - yearsToSubtract).toString();

export const getMinDateYearAgo = (): Date => {
    dayjs.extend(dayOfYear);
    return dayjs().subtract(1, 'year').dayOfYear(1).toDate();
};
