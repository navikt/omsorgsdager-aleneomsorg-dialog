import { Locale } from '@navikt/sif-common-core/lib/types/Locale';

export interface ApiBarn {
    navn: string;
    aktørId?: string;
    identitetsnummer?: string;
    aleneomsorg?: boolean;
}

export interface SoknadApiData {
    id: string;
    språk: Locale;
    barn: ApiBarn[];
    harForståttRettigheterOgPlikter: boolean;
    harBekreftetOpplysninger: boolean;
}
