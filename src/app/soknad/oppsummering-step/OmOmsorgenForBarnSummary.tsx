import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import { ApiBarn } from '../../types/SoknadApiData';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import BarnSummaryList from './BarnSummaryList';
import { Element } from 'nav-frontend-typografi';
import JaNeiSvar from '@navikt/sif-common-soknad/lib/soknad-summary/JaNeiSvar';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';

interface Props {
    barn: ApiBarn[];
}

const OmOmsorgenForBarnSummary = ({ barn }: Props) => {
    const intl = useIntl();

    return (
        <SummarySection header={intlHelper(intl, 'step.oppsummering.om-omsorgen-for-barn.barnList.tittle')}>
            <SummaryBlock header={intlHelper(intl, 'step.oppsummering.om-omsorgen-for-barn.harOmsorgFor.spm')}>
                <JaNeiSvar harSvartJa={barn.length > 0} />
            </SummaryBlock>
            <Box margin="m">
                <Element>{intlHelper(intl, 'step.oppsummering.om-omsorgen-for-barn.barnList.tittle')}</Element>
                <BarnSummaryList barn={barn} />
            </Box>
        </SummarySection>
    );
};

export default OmOmsorgenForBarnSummary;
