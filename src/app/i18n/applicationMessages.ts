import { MessageFileFormat } from '@navikt/sif-common-core/lib/dev-utils/intl/devIntlUtils';
import { allCommonMessages } from '@navikt/sif-common-core/lib/i18n/allCommonMessages';
import soknadIntlMessages from '@navikt/sif-common-soknad/lib/soknad-intl-messages/soknadIntlMessages';
import annetBarnMessages from '@navikt/sif-common-forms/lib/annet-barn/annetBarnMessages';
import { velkommenPageMessages } from '../soknad/velkommen-page/velkommenPageMessages';

const appMessagesNB = require('./nb.json');
const introFormMessagesNB = require('../pages/intro-page/introFormMessagesNB.json');

const bokmålstekster = {
    ...allCommonMessages.nb,
    ...appMessagesNB,
    ...introFormMessagesNB,
    ...soknadIntlMessages.nb,
    ...annetBarnMessages.nb,
    ...velkommenPageMessages.nb,
};

export const applicationIntlMessages: MessageFileFormat = {
    nb: bokmålstekster,
};
