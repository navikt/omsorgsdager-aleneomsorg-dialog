import { SoknadApiData } from '../../types/SoknadApiData';
import { Barn, SoknadFormData } from '../../types/SoknadFormData';
import { mapBarnStepToApiData } from './mapBarnToApiData';

export const mapFormDataToApiData = (
    locale = 'nb',
    formData: SoknadFormData,
    registrerteBarn: Barn[]
): SoknadApiData | undefined => {
    try {
        const apiData: SoknadApiData = {
            spr√•k: locale === 'en' ? 'nn' : 'nb',
            harBekreftetOpplysninger: formData.harBekreftetOpplysninger,
            harForst√•ttRettigheterOgPlikter: formData.harForst√•ttRettigheterOgPlikter,
            ...mapBarnStepToApiData(formData, registrerteBarn),
        };
        return apiData;
    } catch (error) {
        console.error('mapFormDataToApiData failed', error);
        return undefined;
    }
};
