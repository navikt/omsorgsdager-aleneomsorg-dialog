import { StepID } from '../soknad/soknadStepsConfig';

import { Barn, SoknadFormData } from '../types/SoknadFormData';
import { barnFinnesIkkeIArray } from './tidspunktForAleneomsorgUtils';

const welcomingPageIsComplete = ({ harForståttRettigheterOgPlikter }: SoknadFormData) => {
    console.log('welcoming complete ', harForståttRettigheterOgPlikter);
    return harForståttRettigheterOgPlikter === true;
};

const omOmsorgenForBarnIsComplete = (values: SoknadFormData, barn: Barn[]): boolean => {
    console.log('omOmsorgenForBarnIsComplete: values', values);
    console.log('omOmsorgenForBarnIsComplete: barn', values);
    return welcomingPageIsComplete(values) && barn.length > 0 && (values.harAleneomsorgFor || []).length > 0;
};

const tidspunktForAleneomsorgIsComplete = (values: SoknadFormData, barn: Barn[]): boolean => {
    const barnUtenAleneomsorgITidspunkt = values.aleneomsorgTidspunkt.filter((b) =>
        barnFinnesIkkeIArray(b.fnrId, values.harAleneomsorgFor)
    );
    return (
        omOmsorgenForBarnIsComplete(values, barn) &&
        (values.aleneomsorgTidspunkt || []).length > 0 &&
        barnUtenAleneomsorgITidspunkt.length === 0
    );
};

export const getAvailableSteps = (values: SoknadFormData, barn: Barn[]): StepID[] => {
    const steps: StepID[] = [];

    if (welcomingPageIsComplete(values)) {
        steps.push(StepID.OM_OMSORGEN_FOR_BARN);
    }

    if (omOmsorgenForBarnIsComplete(values, barn)) {
        steps.push(StepID.TIDSPUNKT_FOR_ALENEOMSORG);
    }
    if (tidspunktForAleneomsorgIsComplete(values, barn)) {
        steps.push(StepID.OPPSUMMERING);
    }

    return steps;
};

export const isStepAvailable = (stepId: StepID, availableSteps: StepID[]): boolean => {
    return availableSteps.find((id) => id === stepId) !== undefined;
};
