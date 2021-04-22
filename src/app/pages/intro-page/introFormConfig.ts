import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { yesOrNoIsAnswered } from '@navikt/sif-common-core/lib/utils/yesOrNoUtils';

export enum IntroFormField {
    'erSokerAleneOmsorg' = 'erSokerAleneOmsorg',
}

export interface IntroFormData {
    [IntroFormField.erSokerAleneOmsorg]: YesOrNo;
}

export const introFormInitialValues: Partial<IntroFormData> = {
    [IntroFormField.erSokerAleneOmsorg]: YesOrNo.UNANSWERED,
};

export enum IntroFormAvslag {
    erSokerAleneOmsorg = 'erSokerAleneOmsorg',
}

const Q = IntroFormField;

type IntroFormQuestionsPayload = IntroFormData;

const IntroFormConfig: QuestionConfig<IntroFormQuestionsPayload, IntroFormField> = {
    [Q.erSokerAleneOmsorg]: {
        isAnswered: ({ erSokerAleneOmsorg }) => yesOrNoIsAnswered(erSokerAleneOmsorg),
    },
};

export const IntroFormQuestions = Questions<IntroFormQuestionsPayload, IntroFormField>(IntroFormConfig);
