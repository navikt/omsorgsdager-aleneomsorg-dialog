import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { Barn } from '../../types/SoknadFormData';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { AnnetBarn, BarnType } from '@navikt/sif-common-forms/lib/annet-barn/types';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';

export interface AlleBarnSummary {
    navn: string;
    fnr?: string;
    type?: BarnType;
}
interface Props {
    registrertBarn: Barn[];
    annetBarn: AnnetBarn[];
}

const mapRegistrertBarnToAlleBarnSummary = (barn: Barn): AlleBarnSummary => {
    return {
        navn: formatName(barn.fornavn, barn.etternavn, barn.mellomnavn),
    };
};
const mapAnnetBarnToAlleBarnSummary = (annetBarn: AnnetBarn): AlleBarnSummary => {
    return {
        navn: annetBarn.navn,
        fnr: annetBarn.fnr,
        type: annetBarn.type,
    };
};

const OmBarnaSummary = ({ registrertBarn, annetBarn = [] }: Props) => {
    const intl = useIntl();

    const alleBarn: AlleBarnSummary[] = [
        ...registrertBarn.map((barn) => mapRegistrertBarnToAlleBarnSummary(barn)),
        ...annetBarn.map((barn) => mapAnnetBarnToAlleBarnSummary(barn)),
    ];

    return (
        <SummarySection header={intlHelper(intl, 'step.oppsummering.deres-felles-barn.header')}>
            <Box margin="l">
                <SummaryList
                    items={alleBarn}
                    itemRenderer={(alleBarn: AlleBarnSummary): string | React.ReactNode => {
                        const fnr = alleBarn.fnr ? alleBarn.fnr : '';
                        const barnType =
                            alleBarn.type && alleBarn.type !== BarnType.annet
                                ? intlHelper(intl, `step.oppsummering.dineBarn.listItem.${alleBarn.type}`)
                                : '';
                        return <>{`${alleBarn.navn} ${fnr} ${barnType}`}</>;
                    }}
                />
            </Box>
        </SummarySection>
    );
};

export default OmBarnaSummary;
