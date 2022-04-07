import React from 'react';
import { useIntl } from 'react-intl';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { IntroFormData, IntroFormField, introFormInitialValues } from './introFormConfig';
import FormQuestion from '@navikt/sif-common-soknad/lib/form-question/FormQuestion';
import { getTypedFormComponents } from '@navikt/sif-common-formik';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';

interface Props {
    onValidSubmit: () => void;
}

const IntroFormComponents = getTypedFormComponents<IntroFormField, IntroFormData, ValidationError>();

const IntroForm = ({ onValidSubmit }: Props) => {
    const intl = useIntl();
    return (
        <IntroFormComponents.FormikWrapper
            initialValues={introFormInitialValues}
            onSubmit={() => {
                onValidSubmit();
            }}
            renderForm={({ values: { erSokerlestInformasjonen } }) => {
                const lestInformasjonenBesvart = erSokerlestInformasjonen === YesOrNo.YES;

                return (
                    <IntroFormComponents.Form
                        includeValidationSummary={true}
                        formErrorHandler={getIntlFormErrorHandler(intl, 'introForm.validation')}
                        submitButtonLabel={intlHelper(intl, 'introForm.start')}>
                        <FormQuestion
                            legend={intlHelper(intl, `introForm.erSokerlestInformasjonen.spm`)}
                            name={IntroFormField.erSokerlestInformasjonen}
                            validate={(value) => {
                                const error = getYesOrNoValidator()(value);
                                if (error) {
                                    return error;
                                }
                                if (value === YesOrNo.NO) {
                                    return {
                                        key: 'introForm.validation.erSokerlestInformasjonen.nei',
                                        keepKeyUnaltered: true,
                                    };
                                }
                                return undefined;
                            }}
                        />
                        {lestInformasjonenBesvart && (
                            <FormQuestion
                                legend={intlHelper(intl, `introForm.erSokerAleneOmsorg.spm`)}
                                name={IntroFormField.erSokerAleneOmsorg}
                                validate={(value) => {
                                    const error = getYesOrNoValidator()(value);
                                    if (error) {
                                        return error;
                                    }
                                    if (value === YesOrNo.NO) {
                                        return {
                                            key: 'introForm.validation.erSokerAleneOmsorg.nei',
                                            keepKeyUnaltered: true,
                                        };
                                    }
                                    return undefined;
                                }}
                            />
                        )}
                    </IntroFormComponents.Form>
                );
            }}
        />
    );
};

export default IntroForm;
