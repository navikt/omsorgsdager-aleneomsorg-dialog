import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { SoknadFormData, SoknadFormField } from '../types/SoknadFormData';

export const initialSoknadFormData: Partial<SoknadFormData> = {
    [SoknadFormField.harForståttRettigheterOgPlikter]: false,
    [SoknadFormField.harBekreftetOpplysninger]: false,
    [SoknadFormField.avtaleOmDeltBosted]: YesOrNo.UNANSWERED,
    [SoknadFormField.harAvtaleOmDeltBostedFor]: [],
    [SoknadFormField.harAleneomsorgFor]: [],
    [SoknadFormField.aleneomsorgTidspunkt]: [],
};
