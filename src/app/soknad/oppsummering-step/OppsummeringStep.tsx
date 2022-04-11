import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { isPending } from '@devexperts/remote-data-ts';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Person } from 'app/types/Person';
import { SoknadApiData } from '../../types/SoknadApiData';
import { Barn, SoknadFormField } from '../../types/SoknadFormData';
import { useSoknadContext } from '../SoknadContext';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import OmBarnaSummary from './OmBarnaSummary';
import SøkerSummary from './SøkerSummary';
import { getCheckedValidator } from '@navikt/sif-common-formik/lib/validation';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import BarnSummaryList from './BarnSummaryList';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import { AnnetBarn } from '@navikt/sif-common-forms/lib/annet-barn/types';

type Props = {
    søker: Person;
    barn: Barn[];
    annetBarn: AnnetBarn[];
    apiValues?: SoknadApiData;
};

const OppsummeringStep = ({ søker, barn, apiValues, annetBarn = [] }: Props) => {
    const intl = useIntl();
    const { sendSoknadStatus, sendSoknad } = useSoknadContext();

    return (
        <SoknadFormStep
            id={StepID.OPPSUMMERING}
            includeValidationSummary={false}
            showButtonSpinner={isPending(sendSoknadStatus.status)}
            buttonDisabled={isPending(sendSoknadStatus.status)}
            onSendSoknad={apiValues ? () => sendSoknad(apiValues) : undefined}>
            <Box margin="xxxl">
                <CounsellorPanel kompakt={true} type="normal">
                    <FormattedMessage id="step.oppsummering.info" />
                </CounsellorPanel>
                {apiValues === undefined && <div>Api verdier mangler</div>}
                {apiValues !== undefined && (
                    <>
                        <Box margin="xxl">
                            <ResponsivePanel border={true}>
                                <SøkerSummary søker={søker} apiValues={apiValues} />

                                <OmBarnaSummary registrertBarn={barn} annetBarn={annetBarn} />

                                <SummarySection
                                    header={intlHelper(intl, 'step.oppsummering.om-omsorgen-for-barn.barnList.tittle')}>
                                    <Box margin="m">
                                        <BarnSummaryList barn={apiValues.barn} />
                                    </Box>
                                </SummarySection>
                            </ResponsivePanel>
                        </Box>

                        <Box margin="l">
                            <SoknadFormComponents.ConfirmationCheckbox
                                label={intlHelper(intl, 'step.oppsummering.bekrefterOpplysninger')}
                                name={SoknadFormField.harBekreftetOpplysninger}
                                validate={getCheckedValidator()}
                            />
                        </Box>
                    </>
                )}
            </Box>
        </SoknadFormStep>
    );
};

export default OppsummeringStep;
