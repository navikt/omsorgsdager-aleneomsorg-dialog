import React from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useFormikContext } from 'formik';
import AlertStripe from 'nav-frontend-alertstriper';
import { Barn, SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import { CheckboksPanelProps } from 'nav-frontend-skjema';
import { AndreBarn } from '../../pre-common/forms/barn';
import SoknadFormComponents from '../SoknadFormComponents';
import { validateRequiredList } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { barnFinnesIArray } from '../../utils/map-form-data-to-api-data/mapBarnToApiData';

interface Props {
    barn: Barn[];
}

export const getBarnOptions = (
    barn: Barn[] = [],
    andreBarn: AndreBarn[] = [],
    intl: IntlShape
): CheckboksPanelProps[] => {
    return [
        ...barn.map((barnet) => ({
            label: `${intlHelper(intl, 'step.om-omsorgen-for-barn.form.født')} ${prettifyDate(
                barnet.fødselsdato
            )} ${formatName(barnet.fornavn, barnet.etternavn)}`,
            value: barnet.aktørId,
        })),
        ...andreBarn.map((barnet) => ({
            // label: `${intlHelper(intl, 'step.om-barna.form.fnr)} ${prettifyDate(barnet.fødselsdato)} ${barnet.navn}`,
            label: `${barnet.navn} (${intlHelper(intl, 'step.om-omsorgen-for-barn.form.fnr')} ${barnet.fnr})`,
            value: barnet.fnr,
        })),
    ];
};

export const cleanupOmOmsorgenForBarnStep = (formValues: SoknadFormData): SoknadFormData => {
    const values: SoknadFormData = { ...formValues };

    if (values.aleneomsorgTidspunkt) {
        values.aleneomsorgTidspunkt = values.aleneomsorgTidspunkt.filter((b) =>
            barnFinnesIArray(b.fnrId, values.harAleneomsorgFor)
        );
    }

    return values;
};

const OmOmsorgenForBarnStep = ({ barn }: Props) => {
    const intl = useIntl();
    const { values } = useFormikContext<SoknadFormData>();
    const { andreBarn } = values;
    const barnOptions = getBarnOptions(barn, andreBarn, intl);

    const kanFortsette = (barn !== undefined && barn.length > 0) || andreBarn.length > 0;
    return (
        <SoknadFormStep
            id={StepID.OM_OMSORGEN_FOR_BARN}
            showSubmitButton={kanFortsette}
            onStepCleanup={cleanupOmOmsorgenForBarnStep}>
            <CounsellorPanel>
                <p>
                    <FormattedMessage id="step.om-omsorgen-for-barn.stepIntro.1" />
                </p>
                <p>
                    <FormattedMessage id="step.om-omsorgen-for-barn.stepIntro.2" />
                </p>
            </CounsellorPanel>

            {(barn.length > 0 || andreBarn.length > 0) && (
                <Box margin="xl">
                    <SoknadFormComponents.CheckboxPanelGroup
                        legend={intlHelper(intl, 'step.om-omsorgen-for-barn.form.spm.hvilkeAvBarnaAleneomsorg')}
                        name={SoknadFormField.harAleneomsorgFor}
                        checkboxes={barnOptions}
                        validate={validateRequiredList}
                    />
                </Box>
            )}

            {andreBarn.length === 0 && barn.length === 0 && (
                <Box margin="l">
                    <AlertStripe type={'advarsel'}>{intlHelper(intl, 'step.om-barn.info.ingenbarn.2')}</AlertStripe>
                </Box>
            )}
        </SoknadFormStep>
    );
};

export default OmOmsorgenForBarnStep;
