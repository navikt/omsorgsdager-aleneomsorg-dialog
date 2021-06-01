import React from 'react';
import { FormikModalFormAndList, FormikValidateFunction, ModalFormAndListLabels } from '@navikt/sif-common-formik';
import BarnForm from './BarnForm';
import BarnList from './BarnList';
import { AndreBarn } from './types';

interface Props<FieldNames> {
    name: FieldNames;
    validate?: FormikValidateFunction;
    labels: ModalFormAndListLabels;
    placeholderFnr?: string;
    placeholderNavn?: string;
}

function BarnListAndDialog<FieldNames>({ name, validate, labels, placeholderFnr, placeholderNavn }: Props<FieldNames>) {
    return (
        <>
            <FormikModalFormAndList<FieldNames, AndreBarn>
                name={name}
                labels={labels}
                dialogWidth="narrow"
                validate={validate}
                formRenderer={({ onSubmit, onCancel, item }) => (
                    <BarnForm
                        barn={item}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                        labels={{
                            placeholderFnr: placeholderFnr,
                            placeholderNavn: placeholderNavn,
                        }}
                    />
                )}
                listRenderer={({ items, onEdit, onDelete }) => (
                    <BarnList barna={items} onEdit={onEdit} onDelete={onDelete} />
                )}
            />
        </>
    );
}

export default BarnListAndDialog;
