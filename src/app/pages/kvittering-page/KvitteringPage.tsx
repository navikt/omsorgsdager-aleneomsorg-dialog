import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import Kvittering from '@navikt/sif-common-core/lib/components/kvittering/Kvittering';
import { SIFCommonPageKey, useLogSidevisning } from '@navikt/sif-common-amplitude/lib';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../lenker';

const KvitteringPage = () => {
    const intl = useIntl();
    useLogSidevisning(SIFCommonPageKey.kvittering);

    const getTekstTredjeKulepunkt = (): React.ReactNode => {
        return (
            <>
                <FormattedMessage id="kvittering.info.3.1" />{' '}
                <Lenke href={getLenker().saksbehandlingstider} target="_blank">
                    <FormattedMessage id="kvittering.info.3.2.lenke" />
                </Lenke>{' '}
                <FormattedMessage id="kvittering.info.3.3" />.
            </>
        );
    };

    return (
        <Page title={intlHelper(intl, 'application.title')}>
            <Kvittering
                tittel={intlHelper(intl, 'kvittering.tittel')}
                liste={{
                    tittel: intlHelper(intl, 'kvittering.info.tittel'),
                    punkter: [
                        intlHelper(intl, 'kvittering.info.1'),
                        intlHelper(intl, 'kvittering.info.2'),
                        getTekstTredjeKulepunkt(),
                    ],
                }}></Kvittering>
        </Page>
    );
};

export default KvitteringPage;
