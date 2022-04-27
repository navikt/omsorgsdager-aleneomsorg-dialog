import React from 'react';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import { IntlShape, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ApiBarn, TidspunktForAleneomsorgApi } from '../../types/SoknadApiData';
import { apiStringDateToDate, prettifyDateExtended } from '@navikt/sif-common-core/lib/utils/dateUtils';

interface Props {
    barn: ApiBarn[];
}
const tidspunktRenderer = (
    intl: IntlShape,
    navn: string,
    tidspunktForAleneomsorg: TidspunktForAleneomsorgApi,
    dato?: string
): React.ReactNode => {
    return (
        <>
            <div>
                <span>{navn}</span>
            </div>
            <div>
                {tidspunktForAleneomsorg === TidspunktForAleneomsorgApi.TIDLIGERE && (
                    <>
                        <span>
                            {intlHelper(
                                intl,
                                'step.oppsummering.om-omsorgen-for-barn.harOmsorgFor.tidspunktForAleneomsorg.tidligere'
                            )}
                        </span>
                    </>
                )}
                {tidspunktForAleneomsorg === TidspunktForAleneomsorgApi.SISTE_2_ÅRENE && dato && (
                    <>
                        <span>
                            {intlHelper(
                                intl,
                                'step.oppsummering.om-omsorgen-for-barn.harOmsorgFor.tidspunktForAleneomsorg',
                                { dato: prettifyDateExtended(apiStringDateToDate(dato)) }
                            )}
                        </span>
                    </>
                )}
            </div>
        </>
    );
};
const BarnSummaryList = ({ barn }: Props) => {
    const intl = useIntl();
    return (
        <SummaryList
            items={barn}
            itemRenderer={({ navn, tidspunktForAleneomsorg, dato }: ApiBarn): string | React.ReactNode => {
                if (tidspunktForAleneomsorg) {
                    return tidspunktRenderer(intl, navn, tidspunktForAleneomsorg, dato);
                } else return navn;
            }}
        />
    );
};

export default BarnSummaryList;
