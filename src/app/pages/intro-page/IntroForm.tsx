import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { validateYesOrNoIsAnswered } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { getTypedFormComponents, UnansweredQuestionsInfo } from '@navikt/sif-common-formik/lib';
import { QuestionVisibilityContext } from '@navikt/sif-common-soknad/lib/question-visibility/QuestionVisibilityContext';
import { IntroFormData, IntroFormField, introFormInitialValues, IntroFormQuestions } from './introFormConfig';
import IntroFormQuestion from './IntroFormQuestion';

interface Props {
    onValidSubmit: () => void;
}

const IntroFormComponents = getTypedFormComponents<IntroFormField, IntroFormData>();

const IntroForm = ({ onValidSubmit }: Props) => {
    const intl = useIntl();
    return (
        <IntroFormComponents.FormikWrapper
            initialValues={introFormInitialValues}
            onSubmit={() => {
                onValidSubmit();
            }}
            renderForm={({ values }) => {
                const visibility = IntroFormQuestions.getVisbility({
                    ...values,
                });
                const kanFortsette = visibility.areAllQuestionsAnswered();
                return (
                    <IntroFormComponents.Form
                        includeValidationSummary={true}
                        includeButtons={kanFortsette}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}
                        submitButtonLabel={intlHelper(intl, 'introForm.start')}
                        noButtonsContentRenderer={() =>
                            visibility.areAllQuestionsAnswered() ? undefined : (
                                <UnansweredQuestionsInfo>
                                    <FormattedMessage id="page.form.ubesvarteSpørsmålInfo" />
                                </UnansweredQuestionsInfo>
                            )
                        }>
                        <QuestionVisibilityContext.Provider value={{ visibility }}>
                            <IntroFormQuestion
                                name={IntroFormField.erSokerAleneOmsorg}
                                validate={validateYesOrNoIsAnswered}
                                showStop={values.erSokerAleneOmsorg === YesOrNo.NO}
                                stopMessage={<>{intlHelper(intl, 'introForm.erSokerAleneOmsorg.stopMessage')}</>}
                            />
                        </QuestionVisibilityContext.Provider>
                    </IntroFormComponents.Form>
                );
            }}
        />
    );
};

export default IntroForm;
