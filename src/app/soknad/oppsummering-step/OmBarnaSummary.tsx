import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import BarnSummaryList, { AlleBarnSummary } from './BarnSummaryList';
import { AndreBarn } from 'app/pre-common/forms/barn';
import { Barn } from '../../types/SoknadFormData';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';

interface Props {
    registrertBarn: Barn[];
    annetBarn: AndreBarn[];
}
const mapAndreBarnToAlleBarnSummary = (barn: AndreBarn): AlleBarnSummary => {
    return { navn: barn.navn, identitetsnummer: barn.fnr };
};

const mapBarnToAlleBarnSummary = (barn: Barn): AlleBarnSummary => {
    return {
        navn: formatName(barn.fornavn, barn.etternavn, barn.mellomnavn),
    };
};

const OmBarnaSummary = ({ registrertBarn, annetBarn }: Props) => {
    const intl = useIntl();

    const alleBarn: AlleBarnSummary[] = [
        ...annetBarn.map((barn) => mapAndreBarnToAlleBarnSummary(barn)),
        ...registrertBarn.map((barn) => mapBarnToAlleBarnSummary(barn)),
    ];
    return (
        <SummarySection header={intlHelper(intl, 'step.oppsummering.deres-felles-barn.header')}>
            <Box margin="l">
                <BarnSummaryList barn={alleBarn} />
            </Box>
        </SummarySection>
    );
};

export default OmBarnaSummary;
