import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import ContentWithHeader from '@navikt/sif-common-core/lib/components/content-with-header/ContentWithHeader';
import ItemList from '@navikt/sif-common-core/lib/components/item-list/ItemList';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useFormikContext } from 'formik';
import AlertStripe from 'nav-frontend-alertstriper';
import BarnListAndDialog from '../../pre-common/forms/barn/BarnListAndDialog';
import { Barn, SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';

interface Props {
    barn: Barn[];
}

const barnItemLabelRenderer = (barnet: Barn, intl: IntlShape): React.ReactNode => {
    return (
        <div style={{ display: 'flex' }}>
            <span style={{ order: 1 }}>
                {intlHelper(intl, 'step.om-barn.født')} {prettifyDate(barnet.fødselsdato)}
            </span>
            <span style={{ order: 2, paddingLeft: '1rem', justifySelf: 'flex-end' }}>
                {formatName(barnet.fornavn, barnet.etternavn, barnet.mellomnavn)}
            </span>
        </div>
    );
};

const OmBarnStep = ({ barn }: Props) => {
    const intl = useIntl();
    const {
        values: { andreBarn },
    } = useFormikContext<SoknadFormData>();

    const kanFortsette = (barn !== undefined && barn.length > 0) || andreBarn.length > 0;
    return (
        <SoknadFormStep id={StepID.OM_BARN} showSubmitButton={kanFortsette}>
            {barn.length > 0 && (
                <Box margin="xl">
                    <ContentWithHeader header={intlHelper(intl, 'step.om-barn.listHeader.registrerteBarn')}>
                        <ItemList<Barn>
                            getItemId={(registrerteBarn): string => registrerteBarn.aktørId}
                            getItemTitle={(registrerteBarn): string => registrerteBarn.etternavn}
                            labelRenderer={(barnet): React.ReactNode => barnItemLabelRenderer(barnet, intl)}
                            items={barn}
                        />
                    </ContentWithHeader>
                </Box>
            )}

            <Box margin="xl">
                <ContentWithHeader
                    header={
                        andreBarn.length === 0
                            ? intlHelper(intl, 'step.om-barn.spm.andreBarn')
                            : intlHelper(intl, 'step.om-barn.spm.flereBarn')
                    }>
                    {intlHelper(intl, 'step.om-barn.info.spm.text')}
                </ContentWithHeader>
            </Box>
            <Box margin="l">
                <BarnListAndDialog<SoknadFormField>
                    name={SoknadFormField.andreBarn}
                    labels={{
                        addLabel: intlHelper(intl, 'step.om-barn.listDialog.knapplabel'),
                        listTitle: intlHelper(intl, 'step.om-barn.listDialog.listTitle'),
                        modalTitle: intlHelper(intl, 'step.om-barn.listDialog.modalTitle'),
                    }}
                />
            </Box>
            {andreBarn.length === 0 && barn.length === 0 && (
                <Box margin="l">
                    <AlertStripe type={'advarsel'}>{intlHelper(intl, 'step.om-barn.info.ingenbarn.2')}</AlertStripe>
                </Box>
            )}
        </SoknadFormStep>
    );
};

export default OmBarnStep;
