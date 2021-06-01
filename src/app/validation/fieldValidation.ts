import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import {
    createFieldValidationError,
    FieldValidationErrors,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { hasValue } from '@navikt/sif-common-core/lib/validation/hasValue';
import { FieldValidationResult } from '@navikt/sif-common-core/lib/validation/types';
import { AndreBarn } from '../pre-common/forms/barn';

export enum AppFieldValidationErrors {
    fnr_lik_søkerFnr = 'fieldvalidation.mottakersFnrErSøkersFnr',
    mindre_5_bokstaver = 'validationText.mindre_5_bokstaver',
    mer_1000_bokstaver = 'validationText.mer_1000_bokstaver',
    barnIkkeRegistrert = 'validationText.barn_ikke_registrert',
}

export const createAppFieldValidationError = (
    error: AppFieldValidationErrors | FieldValidationErrors,
    values?: any
): FieldValidationResult => {
    return createFieldValidationError<AppFieldValidationErrors | FieldValidationErrors>(error, values);
};

export const validateFødselsnummerIsDifferentThan = (applicantFnr: string) => (fnr: string) => {
    if (hasValue(fnr) && applicantFnr === fnr.trim()) {
        return createFieldValidationError(AppFieldValidationErrors.fnr_lik_søkerFnr);
    }
    return undefined;
};

export const isYesOrNoAnswered = (answer: YesOrNo) => {
    return answer === YesOrNo.NO || answer === YesOrNo.YES || answer === YesOrNo.DO_NOT_KNOW;
};

export const validateBarn = (barn: AndreBarn[]) => {
    if (barn === undefined || barn.length === 0) {
        return createAppFieldValidationError(AppFieldValidationErrors.barnIkkeRegistrert);
    }
};

export const validateTextArea = (text: string): FieldValidationResult => {
    if (text.length < 5) {
        return createAppFieldValidationError(AppFieldValidationErrors.mindre_5_bokstaver);
    }
    if (text.length > 1000) {
        return createAppFieldValidationError(AppFieldValidationErrors.mer_1000_bokstaver);
    }
    return undefined;
};
