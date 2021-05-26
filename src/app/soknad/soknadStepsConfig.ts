import { SoknadApplicationType } from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepTypes';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';

export enum StepID {
    'OM_BARN' = 'om-barn',
    'OM_OMSORGEN_FOR_BARN' = 'om-omsorgen-for-barn',
    'TIDSPUNKT_FOR_ALENEOMSORG' = 'tidspunkt-for-aleneomsorg',
    'OPPSUMMERING' = 'oppsummering',
}

const SoknadSteps: StepID[] = [
    StepID.OM_BARN,
    StepID.OM_OMSORGEN_FOR_BARN,
    StepID.TIDSPUNKT_FOR_ALENEOMSORG,
    StepID.OPPSUMMERING,
];

export const soknadStepsConfig = soknadStepUtils.getStepsConfig(SoknadSteps, SoknadApplicationType.SOKNAD);
