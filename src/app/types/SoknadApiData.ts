import { Locale } from '@navikt/sif-common-core/lib/types/Locale';

export enum TidspunktForAleneomsorgApi {
    SISTE_2_ÅRENE = 'SISTE_2_ÅRENE',
    TIDLIGERE = 'TIDLIGERE',
}
export interface ApiBarn {
    navn: string;
    aktørId?: string;
    identitetsnummer?: string;
    tidspunktForAleneomsorg: TidspunktForAleneomsorgApi;
    dato?: string;
}

export interface SoknadApiData {
    språk: Locale;
    barn: ApiBarn[];
    harForståttRettigheterOgPlikter: boolean;
    harBekreftetOpplysninger: boolean;
}
