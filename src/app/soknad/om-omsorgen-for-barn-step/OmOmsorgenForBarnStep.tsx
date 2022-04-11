import React, { useEffect, useState } from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import AlertStripe from 'nav-frontend-alertstriper';
import { Barn, SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { dateToday, prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import { CheckboksPanelProps } from 'nav-frontend-skjema';
import SoknadFormComponents from '../SoknadFormComponents';
import { barnFinnesIArray } from '../../utils/map-form-data-to-api-data/mapBarnToApiData';
import { getListValidator } from '@navikt/sif-common-formik/lib/validation';
import ItemList from '@navikt/sif-common-core/lib/components/item-list/ItemList';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { Undertittel } from 'nav-frontend-typografi';
import './dineBarn.less';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ContentWithHeader from '@navikt/sif-common-core/lib/components/content-with-header/ContentWithHeader';
import AnnetBarnListAndDialog from '@navikt/sif-common-forms/lib/annet-barn/AnnetBarnListAndDialog';
import { nYearsAgo } from '../../utils/aldersUtils';
import { AnnetBarn } from '@navikt/sif-common-forms/lib/annet-barn/types';
import { Person } from '../../types/Person';
import SoknadTempStorage from '../SoknadTempStorage';

const bem = bemUtils('dineBarn');
interface Props {
    barn: Barn[];
    søker: Person;
    formData: SoknadFormData;
    soknadId?: string;
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

/*const getBarnOptions = (barn: Barn[] = [], intl: IntlShape): CheckboksPanelProps[] => {
    return barn.map((barnet) => ({
        label: `${intlHelper(intl, 'step.om-omsorgen-for-barn.form.født')} ${prettifyDate(
            barnet.fødselsdato
        )} ${formatName(barnet.fornavn, barnet.etternavn)}`,
        value: barnet.aktørId,
    }));
};*/

export const getBarnOptions = (
    barn: Barn[] = [],
    andreBarn: AnnetBarn[] = [],
    intl: IntlShape
): CheckboksPanelProps[] => {
    return [
        ...barn.map((barnet) => ({
            label: `${intlHelper(intl, 'step.om-omsorgen-for-barn.form.født')} ${prettifyDate(
                barnet.fødselsdato
            )} ${formatName(barnet.fornavn, barnet.etternavn)}`,
            value: barnet.aktørId,
        })),
        ...andreBarn.map((barnet) => ({
            label: `${intlHelper(intl, 'step.om-omsorgen-for-barn.form.født')} ${prettifyDate(barnet.fødselsdato)} ${
                barnet.navn
            }`,
            value: barnet.fnr,
        })),
    ];
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

const OmOmsorgenForBarnStep = ({ barn, formData, søker, soknadId }: Props) => {
    const intl = useIntl();
    const [annetBarnChanged, setAnnetBarnChanged] = useState(false);
    const { annetBarn = [] } = formData;
    const annetBarnFnr = annetBarn.map((barn) => barn.fnr);

    useEffect(() => {
        if (annetBarnChanged === true && soknadId !== undefined) {
            setAnnetBarnChanged(false);
            SoknadTempStorage.update(soknadId, formData, StepID.OM_OMSORGEN_FOR_BARN, { søker, barn });
        }
    }, [annetBarnChanged, formData, søker, barn, soknadId]);

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
                    <Undertittel>Dine Barn</Undertittel>
                    <ItemList<Barn>
                        getItemId={(registrerteBarn): string => registrerteBarn.aktørId}
                        getItemTitle={(registrerteBarn): string => registrerteBarn.etternavn}
                        labelRenderer={(barn): React.ReactNode => barnItemLabelRenderer(barn, intl)}
                        items={barn}
                    />
                </Box>
            )}
            <FormBlock>
                <ContentWithHeader
                    header={
                        annetBarn.length === 0
                            ? intlHelper(intl, 'step.om-omsorgen-for-barn.info.spm.andreBarn')
                            : intlHelper(intl, 'step.om-omsorgen-for-barn.info.spm.flereBarn')
                    }>
                    {intlHelper(intl, 'step.om-omsorgen-for-barn.info.spm.text')}
                </ContentWithHeader>
            </FormBlock>
            <Box margin="l">
                <AnnetBarnListAndDialog<SoknadFormField>
                    name={SoknadFormField.annetBarn}
                    labels={{
                        addLabel: intlHelper(intl, 'step.om-omsorgen-for-barn.annetBarnListAndDialog.addLabel'),
                        listTitle: intlHelper(intl, 'step.om-omsorgen-for-barn.annetBarnListAndDialog.listTitle'),
                        modalTitle: intlHelper(intl, 'step.om-omsorgen-for-barn.annetBarnListAndDialog.modalTitle'),
                    }}
                    maxDate={dateToday}
                    minDate={nYearsAgo(19)}
                    disallowedFødselsnumre={[...[søker.fødselsnummer], ...annetBarnFnr]}
                    aldersGrenseText={intlHelper(intl, 'step.om-omsorgen-for-barn.formLeggTilBarn.aldersGrenseInfo')}
                    visBarnTypeValg={true}
                    onAfterChange={() => setAnnetBarnChanged(true)}
                />
            </Box>
            {barn.length > 0 && (
                <Box margin="xl">
                    <SoknadFormComponents.CheckboxPanelGroup
                        legend={intlHelper(intl, 'step.om-omsorgen-for-barn.form.spm.hvilkeAvBarnaAleneomsorg')}
                        name={SoknadFormField.harAleneomsorgFor}
                        checkboxes={getBarnOptions(barn, annetBarn, intl)}
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
