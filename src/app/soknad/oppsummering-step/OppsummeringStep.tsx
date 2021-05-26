import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { isPending } from '@devexperts/remote-data-ts';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import Guide from '@navikt/sif-common-core/lib/components/guide/Guide';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import VeilederSVG from '@navikt/sif-common-core/lib/components/veileder-svg/VeilederSVG';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { validateBekrefterOpplysninger } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { Person } from 'app/types/Person';
import { SoknadApiData } from '../../types/SoknadApiData';
import { Barn, SoknadFormField } from '../../types/SoknadFormData';
import { useSoknadContext } from '../SoknadContext';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import OmBarnaSummary from './OmBarnaSummary';
import SøkerSummary from './SøkerSummary';
import OmOmsorgenForBarnSummary from './OmOmsorgenForBarnSummary';
import { AndreBarn } from 'app/pre-common/question-visibility/forms/barn';

type Props = {
    søker: Person;
    barn: Barn[];
    annetBarn: AndreBarn[];
    apiValues?: SoknadApiData;
};

const OppsummeringStep = ({ søker, barn, annetBarn, apiValues }: Props) => {
    const intl = useIntl();
    const { sendSoknadStatus, sendSoknad } = useSoknadContext();

    // console.log(apiValues);
    return (
        <SoknadFormStep
            id={StepID.OPPSUMMERING}
            includeValidationSummary={false}
            showButtonSpinner={isPending(sendSoknadStatus.status)}
            buttonDisabled={isPending(sendSoknadStatus.status)}
            onSendSoknad={apiValues ? () => sendSoknad(apiValues) : undefined}>
            <Box margin="xxxl">
                <Guide kompakt={true} type="normal" svg={<VeilederSVG />}>
                    <FormattedMessage id="step.oppsummering.info" />
                </Guide>
                {apiValues === undefined && <div>Api verdier mangler</div>}
                {apiValues !== undefined && (
                    <>
                        <Box margin="xxl">
                            <ResponsivePanel border={true}>
                                <SøkerSummary søker={søker} apiValues={apiValues} />

                                <OmBarnaSummary registrertBarn={barn} annetBarn={annetBarn} />
                                <OmOmsorgenForBarnSummary barn={apiValues.barn} />
                            </ResponsivePanel>
                        </Box>

                        <Box margin="l">
                            <SoknadFormComponents.ConfirmationCheckbox
                                label={intlHelper(intl, 'step.oppsummering.bekrefterOpplysninger')}
                                name={SoknadFormField.harBekreftetOpplysninger}
                                validate={validateBekrefterOpplysninger}
                            />
                        </Box>
                    </>
                )}
            </Box>
        </SoknadFormStep>
    );
};

export default OppsummeringStep;
