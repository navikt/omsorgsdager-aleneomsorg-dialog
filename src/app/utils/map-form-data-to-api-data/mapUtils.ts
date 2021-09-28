import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { ApiBarn, TidspunktForAleneomsorgApi } from '../../types/SoknadApiData';
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
    };
};
