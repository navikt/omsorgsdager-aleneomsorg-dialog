import React from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import AlertStripe from 'nav-frontend-alertstriper';
import { Barn, SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import { CheckboksPanelProps } from 'nav-frontend-skjema';
import SoknadFormComponents from '../SoknadFormComponents';
import { barnFinnesIArray } from '../../utils/map-form-data-to-api-data/mapBarnToApiData';
import { getListValidator } from '@navikt/sif-common-formik/lib/validation';
import ItemList from '@navikt/sif-common-core/lib/components/item-list/ItemList';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import './dineBarn.less';

const bem = bemUtils('dineBarn');
interface Props {
    barn: Barn[];
}

const barnItemLabelRenderer = (barn: Barn, intl: IntlShape): React.ReactNode => {
    return (
        <div className={bem.element('label')}>
            <div>{intlHelper(intl, 'step.om-omsorgen-for-barn.form.født')}</div>
            <div className={bem.element('fodselsdato')}>{prettifyDate(barn.fødselsdato)}</div>
            <div className={bem.element('navn')}>{formatName(barn.fornavn, barn.etternavn, barn.mellomnavn)}</div>
        </div>
    );
};

const getBarnOptions = (barn: Barn[] = [], intl: IntlShape): CheckboksPanelProps[] => {
    return barn.map((barnet) => ({
        label: `${intlHelper(intl, 'step.om-omsorgen-for-barn.form.født')} ${prettifyDate(
            barnet.fødselsdato
        )} ${formatName(barnet.fornavn, barnet.etternavn)}`,
        value: barnet.aktørId,
    }));
};

const cleanupOmOmsorgenForBarnStep = (formValues: SoknadFormData): SoknadFormData => {
    const values: SoknadFormData = { ...formValues };

    if (values.aleneomsorgTidspunkt) {
        values.aleneomsorgTidspunkt = values.aleneomsorgTidspunkt.filter((b) =>
            barnFinnesIArray(b.fnrId, values.harAleneomsorgFor)
        );
    }

    return values;
};

const OmOmsorgenForBarnStep = ({ barn }: Props) => {
    const intl = useIntl();
    return (
        <SoknadFormStep
            id={StepID.OM_OMSORGEN_FOR_BARN}
            onStepCleanup={cleanupOmOmsorgenForBarnStep}
            buttonDisabled={barn.length === 0}>
            <CounsellorPanel>
                <p>
                    <FormattedMessage id="step.om-omsorgen-for-barn.stepIntro.1" />
                </p>
                <p>
                    <FormattedMessage id="step.om-omsorgen-for-barn.stepIntro.2" />
                </p>
            </CounsellorPanel>

            {barn.length > 0 && (
                <Box margin="xl">
                    <ItemList<Barn>
                        getItemId={(registrerteBarn): string => registrerteBarn.aktørId}
                        getItemTitle={(registrerteBarn): string => registrerteBarn.etternavn}
                        labelRenderer={(barn): React.ReactNode => barnItemLabelRenderer(barn, intl)}
                        items={barn}
                    />
                </Box>
            )}

            {barn.length > 0 && (
                <Box margin="xl">
                    <SoknadFormComponents.CheckboxPanelGroup
                        legend={intlHelper(intl, 'step.om-omsorgen-for-barn.form.spm.hvilkeAvBarnaAleneomsorg')}
                        name={SoknadFormField.harAleneomsorgFor}
                        checkboxes={getBarnOptions(barn, intl)}
                        validate={getListValidator({ required: true })}
                    />
                </Box>
            )}

            {barn.length === 0 && (
                <Box margin="l">
                    <AlertStripe type={'advarsel'}>
                        {intlHelper(intl, 'step.om-omsorgen-for-barn.ingenbarn')}
                    </AlertStripe>
                </Box>
            )}
        </SoknadFormStep>
    );
};

export default OmOmsorgenForBarnStep;
