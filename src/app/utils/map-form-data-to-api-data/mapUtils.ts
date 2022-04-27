import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { AnnetBarn, BarnType } from '@navikt/sif-common-forms/lib/annet-barn/types';
import { ApiBarn, RegisterteBarnTypeApi, TidspunktForAleneomsorgApi } from '../../types/SoknadApiData';
import { AleneomsorgTidspunkt, Barn, TidspunktForAleneomsorgFormData } from '../../types/SoknadFormData';

const getTidspunktForAleneomsorg = (
    barnId: string,
    aleneomsorgTidspunkter: AleneomsorgTidspunkt[]
): TidspunktForAleneomsorgApi => {
    const tidspunkt = aleneomsorgTidspunkter.find((aleneomsorgTidspunkt) => aleneomsorgTidspunkt.fnrId === barnId);

    if (tidspunkt?.tidspunktForAleneomsorg === TidspunktForAleneomsorgFormData.SISTE_2_ÅRENE)
        return TidspunktForAleneomsorgApi.SISTE_2_ÅRENE;
    else return TidspunktForAleneomsorgApi.TIDLIGERE;
};

const getDateForAleneomsorg = (barnId: string, aleneomsorgTidspunkter: AleneomsorgTidspunkt[]): string | undefined => {
    return aleneomsorgTidspunkter.find((aleneomsorgTidspunkt) => aleneomsorgTidspunkt.fnrId === barnId)?.dato;
};

export const mapBarnToApiBarn = (registrertBarn: Barn, aleneomsorgTidspunkter: AleneomsorgTidspunkt[]): ApiBarn => {
    const tidspunktForAleneomsorg = getTidspunktForAleneomsorg(registrertBarn.aktørId, aleneomsorgTidspunkter);
    return {
        navn: formatName(registrertBarn.fornavn, registrertBarn.etternavn, registrertBarn.mellomnavn),
        aktørId: registrertBarn.aktørId,
        tidspunktForAleneomsorg: tidspunktForAleneomsorg,
        dato:
            tidspunktForAleneomsorg === TidspunktForAleneomsorgApi.SISTE_2_ÅRENE
                ? getDateForAleneomsorg(registrertBarn.aktørId, aleneomsorgTidspunkter)
                : undefined,
        type: RegisterteBarnTypeApi.fraOppslag,
    };
};

export const mapAnnetBarnToApiBarn = (
    annetBarn: AnnetBarn,
    aleneomsorgTidspunkter: AleneomsorgTidspunkt[]
): ApiBarn => {
    const tidspunktForAleneomsorg = getTidspunktForAleneomsorg(annetBarn.fnr, aleneomsorgTidspunkter);
    return {
        navn: annetBarn.navn,
        identitetsnummer: annetBarn.fnr,
        fødselsdato: formatDateToApiFormat(annetBarn.fødselsdato),
        tidspunktForAleneomsorg: tidspunktForAleneomsorg,
        dato:
            tidspunktForAleneomsorg === TidspunktForAleneomsorgApi.SISTE_2_ÅRENE
                ? getDateForAleneomsorg(annetBarn.fnr, aleneomsorgTidspunkter)
                : undefined,
        type: annetBarn.type ? annetBarn.type : BarnType.annet,
    };
};
