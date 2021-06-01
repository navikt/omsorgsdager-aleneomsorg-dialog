import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import SoknadFormComponents from '../soknad/SoknadFormComponents';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { BarnMedAleneomsorg, getMinDateYearAgo, getYear } from '../utils/tidspunktForAleneomsorgUtils';
import { IntlShape } from 'react-intl';
import { useFormikContext } from 'formik';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    AleneomsorgTidspunktField,
    SoknadFormData,
    SoknadFormField,
    TidspunktForAleneomsorgFormData,
} from '../types/SoknadFormData';
import { getRequiredFieldValidator, getDateValidator } from '@navikt/sif-common-formik/lib/validation';

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
                validate={(value) => {
                    const error = getRequiredFieldValidator()(value);
                    return error
                        ? {
                              key: 'validation.tidspunktForAleneomsorg.noValue',

                              values: { barnMedAleneomsorg },
                              keepKeyUnaltered: true,
                          }
                        : undefined;
                }}
            />

            {values[getFieldName(AleneomsorgTidspunktField.tidspunktForAleneomsorg)] ===
                TidspunktForAleneomsorgFormData.SISTE_2_ÅRENE && (
                <Box margin="xl">
                    <SoknadFormComponents.DatePicker
                        name={getFieldName(AleneomsorgTidspunktField.dato) as SoknadFormField}
                        label={intlHelper(intl, 'step.tidspunkt-for-aleneomsorg.siste2årene.dato.spm', {
                            navn: barnMedAleneomsorg.navn,
                        })}
                        showYearSelector={true}
                        minDate={getMinDateYearAgo()}
                        maxDate={dateToday}
                        validate={(value) => {
                            const error = getDateValidator({
                                required: true,
                                min: getMinDateYearAgo(),
                                max: dateToday,
                            })(value);
                            return error
                                ? {
                                      key: `validation.tidspunktForAleneomsorg.dato.${error}`,
                                      values: { barnMedAleneomsorg },
                                      keepKeyUnaltered: true,
                                  }
                                : undefined;
                        }}
                    />
                </Box>
            )}
        </>
    );
};

export default TidspunktForBarn;
