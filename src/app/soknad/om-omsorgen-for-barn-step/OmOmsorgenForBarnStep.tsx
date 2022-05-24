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
import { getListValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import ItemList from '@navikt/sif-common-core/lib/components/item-list/ItemList';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ContentWithHeader from '@navikt/sif-common-core/lib/components/content-with-header/ContentWithHeader';
import AnnetBarnListAndDialog from '@navikt/sif-common-forms/lib/annet-barn/AnnetBarnListAndDialog';
import { nYearsAgo } from '../../utils/aldersUtils';
import { AnnetBarn } from '@navikt/sif-common-forms/lib/annet-barn/types';
import { Person } from '../../types/Person';
import SoknadTempStorage from '../SoknadTempStorage';
import './dineBarn.less';
import { barnFinnesIkkeIArray } from '../../utils/tidspunktForAleneomsorgUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';

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

export const getBarnOptions = (
    barn: Barn[] = [],
    andreBarn: AnnetBarn[] = [],
    intl: IntlShape,
    harAvtaleOmDeltBostedFor?: string[]
): CheckboksPanelProps[] => {
    const filtrertBarn = harAvtaleOmDeltBostedFor
        ? barn.filter((b) => barnFinnesIkkeIArray(b.aktørId, harAvtaleOmDeltBostedFor))
        : barn;
    const filtrertAndreBarn = harAvtaleOmDeltBostedFor
        ? andreBarn.filter((b) => barnFinnesIkkeIArray(b.fnr, harAvtaleOmDeltBostedFor))
        : andreBarn;

    return [
        ...filtrertBarn.map((barnet) => ({
            label: `${intlHelper(intl, 'step.om-omsorgen-for-barn.form.født')} ${prettifyDate(
                barnet.fødselsdato
            )} ${formatName(barnet.fornavn, barnet.etternavn)}`,
            value: barnet.aktørId,
        })),
        ...filtrertAndreBarn.map((barnet) => ({
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

    if (values.avtaleOmDeltBosted === YesOrNo.YES) {
        values.harAleneomsorgFor = values.harAleneomsorgFor.filter((b) =>
            barnFinnesIkkeIArray(b, values.harAvtaleOmDeltBostedFor)
        );
    }

    return values;
};

const OmOmsorgenForBarnStep = ({ barn, formData, søker, soknadId }: Props) => {
    const intl = useIntl();
    const { setFieldValue } = useFormikContext<SoknadFormData>();
    const [annetBarnChanged, setAnnetBarnChanged] = useState(false);
    const { annetBarn = [], harAvtaleOmDeltBostedFor, avtaleOmDeltBosted } = formData;
    const annetBarnFnr = annetBarn.map((barn) => barn.fnr);
    const kanFortsette = barn.length > 0 || annetBarn.length > 0;

    useEffect(() => {
        if (annetBarnChanged === true && soknadId !== undefined) {
            setAnnetBarnChanged(false);
            SoknadTempStorage.update(soknadId, formData, StepID.OM_OMSORGEN_FOR_BARN, { søker, barn });
        }
    }, [annetBarnChanged, formData, søker, barn, soknadId]);

    const clearHarAvtaleOmDeltBostedFor = () => {
        setFieldValue(SoknadFormField.harAvtaleOmDeltBostedFor, []);
    };

    console.log(formData.harAvtaleOmDeltBostedFor);
    console.log(formData.harAleneomsorgFor);
    return (
        <SoknadFormStep
            id={StepID.OM_OMSORGEN_FOR_BARN}
            onStepCleanup={cleanupOmOmsorgenForBarnStep}
            buttonDisabled={
                !kanFortsette ||
                (getBarnOptions(barn, annetBarn, intl, harAvtaleOmDeltBostedFor).length === 0 &&
                    avtaleOmDeltBosted === YesOrNo.YES)
            }>
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
                    <ContentWithHeader header={intlHelper(intl, 'step.om-omsorgen-for-barn.dineBarn.seksjonsTittel')}>
                        <ItemList<Barn>
                            getItemId={(registrerteBarn): string => registrerteBarn.aktørId}
                            getItemTitle={(registrerteBarn): string => registrerteBarn.etternavn}
                            labelRenderer={(barn): React.ReactNode => barnItemLabelRenderer(barn, intl)}
                            items={barn}
                        />
                    </ContentWithHeader>
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

            {kanFortsette && (
                <>
                    <Box margin="xl">
                        <SoknadFormComponents.YesOrNoQuestion
                            legend={intlHelper(intl, 'step.om-omsorgen-for-barn.deltBosted.spm')}
                            name={SoknadFormField.avtaleOmDeltBosted}
                            validate={getYesOrNoValidator()}
                            afterOnChange={clearHarAvtaleOmDeltBostedFor}
                        />
                    </Box>
                    {avtaleOmDeltBosted === YesOrNo.YES && (
                        <Box margin="xl">
                            <SoknadFormComponents.CheckboxPanelGroup
                                legend={intlHelper(intl, 'step.om-omsorgen-for-barn.deltBosted')}
                                name={SoknadFormField.harAvtaleOmDeltBostedFor}
                                checkboxes={getBarnOptions(barn, annetBarn, intl)}
                                validate={getListValidator({ required: true })}
                            />
                        </Box>
                    )}
                    {getBarnOptions(barn, annetBarn, intl, harAvtaleOmDeltBostedFor).length === 0 &&
                        avtaleOmDeltBosted === YesOrNo.YES && (
                            <Box margin="l">
                                <AlertStripe type={'advarsel'}>
                                    {intlHelper(intl, 'step.om-omsorgen-for-barn.alleBarnMedDeltBosted')}
                                </AlertStripe>
                            </Box>
                        )}
                    {getBarnOptions(barn, annetBarn, intl, harAvtaleOmDeltBostedFor).length > 0 &&
                        avtaleOmDeltBosted !== YesOrNo.UNANSWERED && (
                            <Box margin="xl">
                                <SoknadFormComponents.CheckboxPanelGroup
                                    legend={intlHelper(
                                        intl,
                                        'step.om-omsorgen-for-barn.form.spm.hvilkeAvBarnaAleneomsorg'
                                    )}
                                    name={SoknadFormField.harAleneomsorgFor}
                                    checkboxes={getBarnOptions(barn, annetBarn, intl, harAvtaleOmDeltBostedFor)}
                                    validate={getListValidator({ required: true })}
                                />
                            </Box>
                        )}
                </>
            )}

            {!kanFortsette && (
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
