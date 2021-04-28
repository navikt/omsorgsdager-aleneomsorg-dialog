import { AndreBarn } from 'app/pre-common/question-visibility/forms/barn/types';

export interface Barn {
    fødselsdato: Date;
    fornavn: string;
    mellomnavn?: string;
    etternavn: string;
    aktørId: string;
}

export enum SoknadFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',
    andreBarn = 'andreBarn',
    harAleneomsorgFor = 'harAleneomsorgFor',
}

export interface SoknadFormData {
    [SoknadFormField.harForståttRettigheterOgPlikter]: boolean;
    [SoknadFormField.harBekreftetOpplysninger]: boolean;
    [SoknadFormField.andreBarn]: AndreBarn[];
    [SoknadFormField.harAleneomsorgFor]: Array<string>;
}

export type OmBarnaFormData = Pick<SoknadFormData, SoknadFormField.andreBarn>;

export type OmOmsorgenForBarnFormData = Pick<SoknadFormData, SoknadFormField.harAleneomsorgFor>;
