import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import { BarnType } from '@navikt/sif-common-forms/lib/annet-barn/types';

export enum TidspunktForAleneomsorgApi {
    SISTE_2_ÅRENE = 'SISTE_2_ÅRENE',
    TIDLIGERE = 'TIDLIGERE',
}

export enum RegisterteBarnTypeApi {
    'fraOppslag' = 'FRA_OPPSLAG',
}
export interface ApiBarn {
    navn: string;
    tidspunktForAleneomsorg: TidspunktForAleneomsorgApi;
    type: RegisterteBarnTypeApi | BarnType;
    aktørId?: string;
    identitetsnummer?: string;
    fødselsdato?: ApiStringDate;
    dato?: string;
}

export interface SoknadApiData {
    språk: Locale;
    barn: ApiBarn[];
    harForståttRettigheterOgPlikter: boolean;
    harBekreftetOpplysninger: boolean;
}
