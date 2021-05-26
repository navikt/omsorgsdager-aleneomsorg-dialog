import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
// import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import { FieldArray, useFormikContext } from 'formik';
import {
    AleneomsorgTidspunktField,
    SoknadFormData,
    // SoknadFormData,
    SoknadFormField,
    TidspunktForAleneomsorgFormData,
} from '../types/SoknadFormData';
import SoknadFormComponents from '../soknad/SoknadFormComponents';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { BarnMedAleneomsorg } from '../utils/tidspunktForAleneomsorgUtils';
import { IntlShape } from 'react-intl';

interface Props {
    barnMedAleneomsorg: BarnMedAleneomsorg;
    index: number;
}

const tidspunktItemLabelRenderer = (navn: string, intl: IntlShape): React.ReactNode => {
    return (
        <>
            <div>
                <span>{navn}</span>
            </div>

            <div>
                <span>{intlHelper(intl, 'step.tidspunkt-for-aleneomsorg.spm', { navn })}</span>
            </div>
        </>
    );
};

const FormikTidspunkt = ({ barnMedAleneomsorg, index }: Props) => {
    const intl = useIntl();
    const {
        values: { aleneomsorgTidspunkt },
        setFieldValue,
    } = useFormikContext<SoknadFormData>();

    React.useEffect(() => {
        if (aleneomsorgTidspunkt) {
            const tp = aleneomsorgTidspunkt.find((tp) => tp.fnrId);
            if (tp && tp.tidspunktForAleneomsorg === TidspunktForAleneomsorgFormData.TIDLIGERE && tp.dato) {
                setFieldValue(`${SoknadFormField.aleneomsorgTidspunkt}.${index}.dato` as SoknadFormField, undefined);
            }
        }
        if (!aleneomsorgTidspunkt) {
            setFieldValue(
                `${SoknadFormField.aleneomsorgTidspunkt}.${index}.fnrId` as SoknadFormField,
                barnMedAleneomsorg.idFnr
            );
        }

        if (
            aleneomsorgTidspunkt &&
            !aleneomsorgTidspunkt[index] &&
            !aleneomsorgTidspunkt.find((tp) => tp.fnrId === barnMedAleneomsorg.idFnr)
        ) {
            setFieldValue(
                `${SoknadFormField.aleneomsorgTidspunkt}.${index}.fnrId` as SoknadFormField,
                barnMedAleneomsorg.idFnr
            );
        }

        if (aleneomsorgTidspunkt && !aleneomsorgTidspunkt.find((tp) => tp.fnrId === barnMedAleneomsorg.idFnr)) {
            setFieldValue(
                `${SoknadFormField.aleneomsorgTidspunkt}.${index}.fnrId` as SoknadFormField,
                barnMedAleneomsorg.idFnr
            );
        }
    }, [setFieldValue, aleneomsorgTidspunkt, barnMedAleneomsorg.idFnr, index]);
    // console.log(aleneomsorgTidspunkt);
    return (
        <FieldArray name={SoknadFormField.aleneomsorgTidspunkt}>
            {({ name }) => {
                const getFieldName = (field: AleneomsorgTidspunktField) =>
                    `${name}.${index}.${field}` as SoknadFormField;

                return (
                    <Box margin="xl">
                        <SoknadFormComponents.RadioPanelGroup
                            legend={tidspunktItemLabelRenderer(barnMedAleneomsorg.navn, intl)}
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

                        {aleneomsorgTidspunkt &&
                            aleneomsorgTidspunkt[index] &&
                            aleneomsorgTidspunkt[index].tidspunktForAleneomsorg ===
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
