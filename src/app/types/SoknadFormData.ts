import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { AnnetBarn } from '@navikt/sif-common-forms/lib/annet-barn/types';
export interface Barn {
    fødselsdato: Date;
    fornavn: string;
    mellomnavn?: string;
    etternavn: string;
    aktørId: string;
}

export interface AleneomsorgTidspunkt {
    fnrId: string;
    tidspunktForAleneomsorg?: TidspunktForAleneomsorgFormData;
    dato?: string;
}

export enum TidspunktForAleneomsorgFormData {
    SISTE_2_ÅRENE = 'SISTE_2_ÅRENE',
    TIDLIGERE = 'TIDLIGERE',
}

export enum AleneomsorgTidspunktField {
    fnrId = 'fnrId',
    tidspunktForAleneomsorg = 'tidspunktForAleneomsorg',
    dato = 'dato',
}

export enum SoknadFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',
    annetBarn = 'annetBarn',
    avtaleOmDeltBosted = 'avtaleOmDeltBosted',
    harAvtaleOmDeltBostedFor = 'harAvtaleOmDeltBostedFor',
    harAleneomsorgFor = 'harAleneomsorgFor',
    aleneomsorgTidspunkt = 'aleneomsorgTidspunkt',
}

export interface SoknadFormData {
    [SoknadFormField.harForståttRettigheterOgPlikter]: boolean;
    [SoknadFormField.harBekreftetOpplysninger]: boolean;
    [SoknadFormField.annetBarn]: AnnetBarn[];
    [SoknadFormField.avtaleOmDeltBosted]: YesOrNo;
    [SoknadFormField.harAvtaleOmDeltBostedFor]: Array<string>;
    [SoknadFormField.harAleneomsorgFor]: Array<string>;
    [SoknadFormField.aleneomsorgTidspunkt]: AleneomsorgTidspunkt[];
}

export type OmOmsorgenForBarnFormData = Pick<
    SoknadFormData,
    SoknadFormField.harAleneomsorgFor | SoknadFormField.annetBarn
>;

export type TidspunktForAleneomsorg = Pick<SoknadFormData, SoknadFormField.aleneomsorgTidspunkt>;
