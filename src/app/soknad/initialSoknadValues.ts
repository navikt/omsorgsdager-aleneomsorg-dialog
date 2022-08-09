import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { SoknadFormData, SoknadFormField } from '../types/SoknadFormData';

export const initialSoknadFormData: SoknadFormData = {
    [SoknadFormField.harForståttRettigheterOgPlikter]: false,
    [SoknadFormField.annetBarn]: [],
    [SoknadFormField.harBekreftetOpplysninger]: false,
    [SoknadFormField.avtaleOmDeltBosted]: YesOrNo.UNANSWERED,
    [SoknadFormField.harAvtaleOmDeltBostedFor]: [],
    [SoknadFormField.harAleneomsorgFor]: [],
    [SoknadFormField.aleneomsorgTidspunkt]: [],
};
