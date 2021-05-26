import React from 'react';
// import { useIntl } from 'react-intl';
// import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { FieldArray, useFormikContext } from 'formik';

// import AppForm from '../app-form/AppForm';
// import RedusertArbeidsforholdDetaljerPart from './RedusertArbeidsforholdDetaljerPart';
// import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';

import {
    AleneomsorgTidspunktField,
    SoknadFormData,
    SoknadFormField,
    TidspunktForAleneomsorgFormData,
} from '../types/SoknadFormData';
import SoknadFormComponents from '../soknad/SoknadFormComponents';
import { BarnMedAleneomsorg } from '../soknad/tidspunkt-for-aleneomsorg-step/TidspunktForAleneomsorgStep';
import Box from '@navikt/sif-common-core/lib/components/box/Box';

interface Props {
    barnMedAleneomsorg: BarnMedAleneomsorg;
    index: number;
}

const FormikTidspunkt = ({ barnMedAleneomsorg, index }: Props) => {
    // const intl = useIntl();
    const { values, setFieldValue } = useFormikContext<SoknadFormData>();

    return (
        <FieldArray name={SoknadFormField.aleneomsorgTidspunkt}>
            {({ name }) => {
                const getFieldName = (field: AleneomsorgTidspunktField) =>
                    `${name}.${index}.${field}` as SoknadFormField;

                if (
                    values.aleneomsorgTidspunkt &&
                    (!values.aleneomsorgTidspunkt[index] || values.aleneomsorgTidspunkt[index].fnrId === undefined)
                )
                    setFieldValue(getFieldName(AleneomsorgTidspunktField.fnrId), barnMedAleneomsorg.idFnr);

                if (
                    values.aleneomsorgTidspunkt &&
                    values.aleneomsorgTidspunkt[index] &&
                    values.aleneomsorgTidspunkt[index].dato &&
                    values.aleneomsorgTidspunkt[index].tidspunktForAleneomsorg ===
                        TidspunktForAleneomsorgFormData.TIDLIGERE
                )
                    setFieldValue(getFieldName(AleneomsorgTidspunktField.dato), undefined);

                return (
                    <Box margin="xl">
                        <SoknadFormComponents.RadioPanelGroup
                            legend={`Hvilket år ble du alene om omsorgen for ${barnMedAleneomsorg.navn}`}
                            name={getFieldName(AleneomsorgTidspunktField.tidspunktForAleneomsorg)}
                            radios={[
                                {
                                    // label: intlHelper(intl, 'steg.tilsyn.ja.årsak.vetHelePerioden'),
                                    label: 'I 2020 eller 2021',
                                    value: TidspunktForAleneomsorgFormData.SISTE_2_ÅRENE,
                                },
                                {
                                    label: 'I 2019 eller tidlegere',
                                    value: TidspunktForAleneomsorgFormData.TIDLIGERE,
                                },
                            ]}
                        />
                        {values.aleneomsorgTidspunkt &&
                            values.aleneomsorgTidspunkt[index] &&
                            values.aleneomsorgTidspunkt[index].tidspunktForAleneomsorg ===
                                TidspunktForAleneomsorgFormData.SISTE_2_ÅRENE && (
                                <Box margin="xl">
                                    <SoknadFormComponents.DatePicker
                                        name={getFieldName(AleneomsorgTidspunktField.dato)}
                                        // label={intlHelper(intl, 'frilanser.nårSluttet.spm')}
                                        label={`Hvilken dato ble du alene om omsorgen for ${barnMedAleneomsorg.navn}`}
                                        showYearSelector={true}
                                        // minDate={datepickerUtils.getDateFromDateString(frilans_startdato)}
                                        // maxDate={dateToday}
                                    />
                                </Box>
                            )}
                    </Box>
                );
            }}
        </FieldArray>
    );
};

export default FormikTidspunkt;
