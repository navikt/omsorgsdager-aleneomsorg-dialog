import { Person } from 'app/types/Person';
import { StepID } from '../soknad/soknadStepsConfig';

import { Barn, OmBarnaFormData, OmOmsorgenForBarnFormData, SoknadFormData } from '../types/SoknadFormData';

const omBarnaIsComplete = ({ andreBarn }: Partial<OmBarnaFormData>, barn: Barn[]): boolean => {
    return barn.length > 0 || (andreBarn || []).length > 0;
};
const omOmsorgenForBarnIsComplete = ({ harAleneomsorgFor }: Partial<OmOmsorgenForBarnFormData>): boolean => {
    return harAleneomsorgFor?.length === 0 ? false : true;
};

// TODO: endre
const tidspunktForAleneomsorgIsComplete = (): boolean => {
    return true;
};

export const getAvailableSteps = (values: Partial<SoknadFormData>, søker: Person, barn: Barn[]): StepID[] => {
    const steps: StepID[] = [];
    steps.push(StepID.OM_BARN);

    if (omBarnaIsComplete(values, barn)) {
        steps.push(StepID.OM_OMSORGEN_FOR_BARN);
    }

    if (omOmsorgenForBarnIsComplete(values)) {
        steps.push(StepID.TIDSPUNKT_FOR_ALENEOMSORG);
    }
    if (tidspunktForAleneomsorgIsComplete()) {
        steps.push(StepID.OPPSUMMERING);
    }

    return steps;
};

export const isStepAvailable = (stepId: StepID, availableSteps: StepID[]): boolean => {
    return availableSteps.find((id) => id === stepId) !== undefined;
};
