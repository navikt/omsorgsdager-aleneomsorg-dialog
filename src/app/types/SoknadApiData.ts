import { Locale } from '@navikt/sif-common-core/lib/types/Locale';

export interface ApiBarn {
    identitetsnummer?: string;
    aktørId?: string;
    navn: string;
}

export interface SoknadApiData {
    id: string;
    språk: Locale;
    harForståttRettigheterOgPlikter: boolean;
    harBekreftetOpplysninger: boolean;
    barn: ApiBarn[];
}
