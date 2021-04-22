import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
// import FormattedHtmlMessage from '@navikt/sif-common-core/lib/components/formatted-html-message/FormattedHtmlMessage';
import InformationPoster from '@navikt/sif-common-core/lib/components/information-poster/InformationPoster';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { navigateToSoknadFrontpage } from '../../utils/navigationUtils';
import IntroForm from './IntroForm';
import { SIFCommonPageKey, useLogSidevisning } from '@navikt/sif-common-amplitude/lib';

const IntroPage = () => {
    const intl = useIntl();
    const history = useHistory();
    useLogSidevisning(SIFCommonPageKey.intro);

    return (
        <Page
            title={intlHelper(intl, 'application.title')}
            topContentRenderer={() => <StepBanner tag="h1" text={intlHelper(intl, 'application.title')} />}>
            <Box margin="xxxl">
                <InformationPoster>
                    <p>
                        Her kan du registrere at du er alene om omsorg for barn i forbindelse med bruk av omsorgsdager.
                    </p>
                    <p>
                        Når du er alene om omsorg for barn får du doblet antall omsorgsdager. Dette må registreres hos
                        NAV slik at vi kan utbetale riktig antall dager hvis arbeidstaker søker refusjon eller hvis du
                        selv skal søke om utbetaling av dager.
                    </p>
                    <p>
                        Du regnes som alene om omsorgen hvis du ikke bor sammen med den andre forelderen, og barnet bor
                        fast bare hos deg. Hvis du og den andre forelderen har en avtale om delt bosted, hvor barnet bor
                        fast hos dere begge, vil ingen av dere bli regnet som alene om omsorgen.
                    </p>
                    <p>
                        Hvis du registrerer aleneomsorg og senere flytter sammen med forelder til barn du har sagt du er
                        alene for må du gi beskjed til oss ved å sende en melding via skriv til oss (lenke)
                    </p>
                </InformationPoster>
            </Box>
            <FormBlock>
                <IntroForm
                    onValidSubmit={() => {
                        setTimeout(() => {
                            navigateToSoknadFrontpage(history);
                        });
                    }}
                />
            </FormBlock>
        </Page>
    );
};

export default IntroPage;
