import { AndreBarn } from 'app/pre-common/question-visibility/forms/barn/types';

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
    andreBarn = 'andreBarn',
    harAleneomsorgFor = 'harAleneomsorgFor',
    aleneomsorgTidspunkt = 'aleneomsorgTidspunkt',
}

export interface SoknadFormData {
    [SoknadFormField.harForståttRettigheterOgPlikter]: boolean;
    [SoknadFormField.harBekreftetOpplysninger]: boolean;
    [SoknadFormField.andreBarn]: AndreBarn[];
    [SoknadFormField.harAleneomsorgFor]: Array<string>;
    [SoknadFormField.aleneomsorgTidspunkt]: AleneomsorgTidspunkt[];
}

export type OmBarnaFormData = Pick<SoknadFormData, SoknadFormField.andreBarn>;

export type OmOmsorgenForBarnFormData = Pick<SoknadFormData, SoknadFormField.harAleneomsorgFor>;

export type TidspunktForAleneomsorg = Pick<SoknadFormData, SoknadFormField.aleneomsorgTidspunkt>;
