import React from 'react';
import { FormattedMessage } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import { Undertittel } from 'nav-frontend-typografi';
import BehandlingAvPersonopplysningerContent from './BehandlingAvPersonopplysningerContent';

const OmSøknaden = () => {
    return (
        <Box margin="xl">
            <Undertittel tag="h2">
                <FormattedMessage id="page.velkommen.omSøknaden.tittel" />
            </Undertittel>

            <FormattedMessage id="page.velkommen.omSøknaden.1" tagName="p" />
            <FormattedMessage id="page.velkommen.omSøknaden.2" tagName="p" />
            <FormattedMessage id="page.velkommen.omSøknaden.3" tagName="p" />
            <ExpandableInfo title="Om hvordan vi innhenter opplysninger om deg">
                <BehandlingAvPersonopplysningerContent />
            </ExpandableInfo>
        </Box>
    );
};

export default OmSøknaden;
