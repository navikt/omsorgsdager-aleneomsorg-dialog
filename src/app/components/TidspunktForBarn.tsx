import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import SoknadFormComponents from '../soknad/SoknadFormComponents';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { BarnMedAleneomsorg, getMinDateYearAgo, getYear } from '../utils/tidspunktForAleneomsorgUtils';
import { IntlShape } from 'react-intl';
import { validateRequiredField } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { useFormikContext } from 'formik';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    AleneomsorgTidspunktField,
    SoknadFormData,
    SoknadFormField,
    TidspunktForAleneomsorgFormData,
} from '../types/SoknadFormData';

interface Props {
    barnMedAleneomsorg: BarnMedAleneomsorg;
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

const TidspunktForBarn = ({ barnMedAleneomsorg }: Props) => {
    const intl = useIntl();
    const { values } = useFormikContext<SoknadFormData>();

    const getFieldName = (fieldName: AleneomsorgTidspunktField): string => {
        return `${fieldName}_${barnMedAleneomsorg.idFnr}`;
    };
    return (
        <>
            <SoknadFormComponents.RadioPanelGroup
                name={getFieldName(AleneomsorgTidspunktField.tidspunktForAleneomsorg) as SoknadFormField}
                legend={tidspunktItemLabelRenderer(barnMedAleneomsorg.navn, intl)}
                radios={[
                    {
                        label: intlHelper(intl, 'step.tidspunkt-for-aleneomsorg.radioPanelGroupLabel.siste2årene', {
                            yearAgo: getYear(1),
                            yearNow: getYear(0),
                        }),

                        value: TidspunktForAleneomsorgFormData.SISTE_2_ÅRENE,
                    },
                    {
                        label: intlHelper(intl, 'step.tidspunkt-for-aleneomsorg.radioPanelGroupLabel.tidlegere', {
                            twoYearsAgo: getYear(2),
                        }),
                        value: TidspunktForAleneomsorgFormData.TIDLIGERE,
                    },
                ]}
                validate={validateRequiredField}
            />

            {values[getFieldName(AleneomsorgTidspunktField.tidspunktForAleneomsorg)] ===
                TidspunktForAleneomsorgFormData.SISTE_2_ÅRENE && (
                <Box margin="xl">
                    <SoknadFormComponents.DatePicker
                        name={getFieldName(AleneomsorgTidspunktField.dato) as SoknadFormField}
                        label={intlHelper(intl, 'step.tidspunkt-for-aleneomsorg.spm', {
                            navn: barnMedAleneomsorg.navn,
                        })}
                        showYearSelector={true}
                        minDate={getMinDateYearAgo()}
                        maxDate={dateToday}
                        validate={validateRequiredField}
                    />
                </Box>
            )}
        </>
    );
};

export default TidspunktForBarn;
