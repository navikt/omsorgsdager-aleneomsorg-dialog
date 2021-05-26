import React from 'react';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { TidspunktForAleneomsorgApi } from '../../types/SoknadApiData';

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
                <span>{`Hvilket år ble du alene om omsorgen for ${navn}?`}</span>
            </div>
            <div>
                {tidspunktForAleneomsorg === TidspunktForAleneomsorgApi.TIDLIGERE && (
                    <>
                        <span>I 2019 eller tidligere</span>
                    </>
                )}
                {tidspunktForAleneomsorg === TidspunktForAleneomsorgApi.SISTE_2_ÅRENE && dato && (
                    <>
                        <div>
                            <span>I 2020 eller 2021</span>
                        </div>
                        <div>
                            <span>{`Dato: ${dato}`}</span>
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
                    return tidspunktRenderer(navn, fnr, tidspunktForAleneomsorg, dato);
                } else return `${navn}${fnr}`;
            }}
        />
    );
};

export default BarnSummaryList;
