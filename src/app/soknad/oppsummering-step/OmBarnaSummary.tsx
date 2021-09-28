import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import BarnSummaryList, { AlleBarnSummary } from './BarnSummaryList';
import { Barn } from '../../types/SoknadFormData';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';

interface Props {
    registrertBarn: Barn[];
}

const mapBarnToAlleBarnSummary = (barn: Barn): AlleBarnSummary => {
    return {
        navn: formatName(barn.fornavn, barn.etternavn, barn.mellomnavn),
    };
};

const OmBarnaSummary = ({ registrertBarn }: Props) => {
    const intl = useIntl();

    const alleBarn: AlleBarnSummary[] = registrertBarn.map((barn) => mapBarnToAlleBarnSummary(barn));

    return (
        <SummarySection header={intlHelper(intl, 'step.oppsummering.deres-felles-barn.header')}>
            <Box margin="l">
                <BarnSummaryList barn={alleBarn} />
            </Box>
        </SummarySection>
    );
};

export default OmBarnaSummary;
