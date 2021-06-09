import React from 'react';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import { IntlShape, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { TidspunktForAleneomsorgApi } from '../../types/SoknadApiData';
import { getYear } from '../../utils/tidspunktForAleneomsorgUtils';
import { apiStringDateToDate, prettifyDateExtended } from '@navikt/sif-common-core/lib/utils/dateUtils';

export interface AlleBarnSummary {
    navn: string;
    identitetsnummer?: string;
    tidspunktForAleneomsorg?: TidspunktForAleneomsorgApi;
    dato?: string;
}
interface Props {
    barn: AlleBarnSummary[];
}
const tidspunktRenderer = (
    intl: IntlShape,
    navn: string,
    fnr: string,
    tidspunktForAleneomsorg: TidspunktForAleneomsorgApi,
    dato?: string
): React.ReactNode => {
    return (
        <>
            <div>
                <span>{`${navn}${fnr}`}</span>
            </div>
            <div>
                <span>{intlHelper(intl, 'step.oppsummering.om-omsorgen-for-barn.tidspunkt.spm', { navn })}</span>
            </div>
            <div>
                {tidspunktForAleneomsorg === TidspunktForAleneomsorgApi.TIDLIGERE && (
                    <>
                        <span>
                            {intlHelper(
                                intl,
                                'step.oppsummering.om-omsorgen-for-barn.harOmsorgFor.tidspunkt.tidligere',
                                {
                                    twoYearsAgo: getYear(2),
                                }
                            )}
                        </span>
                        <div>
                            <span>{`${intlHelper(
                                intl,
                                'step.oppsummering.om-omsorgen-for-barn.harOmsorgFor.tidspunktForAleneomsorg'
                            )} ${intlHelper(
                                intl,
                                'step.oppsummering.om-omsorgen-for-barn.harOmsorgFor.tidspunktForAleneomsorg.tidligere'
                            )}`}</span>
                        </div>
                    </>
                )}
                {tidspunktForAleneomsorg === TidspunktForAleneomsorgApi.SISTE_2_ÅRENE && dato && (
                    <>
                        <div>
                            <span>
                                {intlHelper(
                                    intl,
                                    'step.oppsummering.om-omsorgen-for-barn.harOmsorgFor.tidspunkt.siste2årene',
                                    {
                                        yearAgo: getYear(1),
                                        yearNow: getYear(0),
                                    }
                                )}
                            </span>
                        </div>
                        <div>
                            <span>{`${intlHelper(
                                intl,
                                'step.oppsummering.om-omsorgen-for-barn.harOmsorgFor.tidspunktForAleneomsorg'
                            )} ${prettifyDateExtended(apiStringDateToDate(dato))}`}</span>
                        </div>
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
            itemRenderer={({
                identitetsnummer,
                navn,
                tidspunktForAleneomsorg,
                dato,
            }: AlleBarnSummary): string | React.ReactNode => {
                const fnr = identitetsnummer
                    ? intlHelper(intl, 'step.oppsummering.deres-felles-barn.listItem', { identitetsnummer })
                    : '';
                if (tidspunktForAleneomsorg) {
                    return tidspunktRenderer(intl, navn, fnr, tidspunktForAleneomsorg, dato);
                } else return `${navn}${fnr}`;
            }}
        />
    );
};

export default BarnSummaryList;
