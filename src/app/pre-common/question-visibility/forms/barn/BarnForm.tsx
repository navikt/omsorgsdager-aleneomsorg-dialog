import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import {
    validateAll,
    validateRequiredField,
    validateFødselsnummer,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { Systemtittel } from 'nav-frontend-typografi';
import { AndreBarn } from './types';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import barnUtils from './barnUtils';
import { guid } from 'nav-frontend-js-utils';

interface BarnFormLabels {
    title: string;
    fnr: string;
    placeholderFnr?: string;
    navn: string;
    placeholderNavn?: string;
    okButton: string;
    cancelButton: string;
}

interface Props {
    barn?: Partial<AndreBarn>;
    labels?: Partial<BarnFormLabels>;
    selectDescription?: string;
    onSubmit: (values: AndreBarn) => void;
    onCancel: () => void;
}

enum BarnFormFields {
    fnr = 'fnr',
    navn = 'navn',
}

type BarnFormValues = Partial<AndreBarn>;

const Form = getTypedFormComponents<BarnFormFields, BarnFormValues>();

const BarnForm = ({ barn = { id: undefined, fnr: '', navn: '' }, labels, onSubmit, onCancel }: Props) => {
    const intl = useIntl();

    const onFormikSubmit = (formValues: BarnFormValues) => {
        if (barnUtils.isBarn(formValues)) {
            onSubmit({ ...formValues, id: barn.id || guid() });
        } else {
            throw new Error('BarnForm: Formvalues is not a valid AnnetBarn on submit.');
        }
    };

    const defaultLabels: BarnFormLabels = {
        title: intlHelper(intl, 'barn.form.title'),
        fnr: intlHelper(intl, 'barn.form.fnr'),
        navn: intlHelper(intl, 'barn.form.navn'),
        okButton: intlHelper(intl, 'barn.form.okButton'),
        cancelButton: intlHelper(intl, 'barn.form.cancelButton'),
    };

    const formLabels: BarnFormLabels = { ...defaultLabels, ...labels };

    return (
        <>
            <Form.FormikWrapper
                initialValues={barnUtils.mapBarnToFormValues(barn)}
                onSubmit={onFormikSubmit}
                renderForm={() => (
                    <Form.Form
                        onCancel={onCancel}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                        <Systemtittel tag="h1">{formLabels.title}</Systemtittel>
                        <FormBlock>
                            <Form.Input
                                name={BarnFormFields.navn}
                                label={formLabels.navn}
                                validate={validateRequiredField}
                                placeholder={formLabels.placeholderNavn}
                            />
                        </FormBlock>

                        <FormBlock>
                            <Form.Input
                                name={BarnFormFields.fnr}
                                label={formLabels.fnr}
                                validate={validateAll([validateRequiredField, validateFødselsnummer])}
                                inputMode="numeric"
                                maxLength={11}
                                placeholder={formLabels.placeholderFnr}
                            />
                        </FormBlock>
                    </Form.Form>
                )}
            />
        </>
    );
};

export default BarnForm;
