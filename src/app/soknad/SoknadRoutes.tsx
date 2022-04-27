import React from 'react';
import { useIntl } from 'react-intl';
import { Redirect, Route, Switch } from 'react-router-dom';
import { isFailure, isInitial, isPending, isSuccess } from '@devexperts/remote-data-ts';
import LoadWrapper from '@navikt/sif-common-core/lib/components/load-wrapper/LoadWrapper';
import ErrorPage from '@navikt/sif-common-soknad/lib/soknad-common-pages/ErrorPage';
import SoknadErrorMessages, {
    LastAvailableStepInfo,
} from '@navikt/sif-common-soknad/lib/soknad-error-messages/SoknadErrorMessages';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';
import { useFormikContext } from 'formik';
import AppRoutes from '../config/routeConfig';
import KvitteringPage from '../pages/kvittering-page/KvitteringPage';
import { Person } from '../types/Person';
import { Barn, SoknadFormData } from '../types/SoknadFormData';
import { getAvailableSteps } from '../utils/getAvailableSteps';
import { mapFormDataToApiData } from '../utils/map-form-data-to-api-data/mapFormDataToApiData';
import OppsummeringStep from './oppsummering-step/OppsummeringStep';
import { useSoknadContext } from './SoknadContext';
import { StepID } from './soknadStepsConfig';
import VelkommenPage from './velkommen-page/VelkommenPage';
import OmOmsorgenForBarnStep from './om-omsorgen-for-barn-step/OmOmsorgenForBarnStep';
import TidspunktForAleneomsorgStep from './tidspunkt-for-aleneomsorg-step/TidspunktForAleneomsorgStep';

interface Props {
    soknadId?: string;
    søker: Person;
    barn?: Barn[];
}

const SoknadRoutes = ({ soknadId, søker, barn = [] }: Props) => {
    const intl = useIntl();
    const { values } = useFormikContext<SoknadFormData>();
    const availableSteps = getAvailableSteps(values, barn);
    const { soknadStepsConfig, sendSoknadStatus } = useSoknadContext();
    const renderSoknadStep = (søker: Person, barn: Barn[], stepID: StepID): React.ReactNode => {
        switch (stepID) {
            case StepID.OM_OMSORGEN_FOR_BARN:
                return <OmOmsorgenForBarnStep barn={barn} søker={søker} formData={values} soknadId={soknadId} />;
            case StepID.TIDSPUNKT_FOR_ALENEOMSORG:
                return <TidspunktForAleneomsorgStep barn={barn} />;
            case StepID.OPPSUMMERING:
                const apiValues = mapFormDataToApiData(intl.locale, values, barn);
                return (
                    <OppsummeringStep apiValues={apiValues} søker={søker} barn={barn} annetBarn={values.annetBarn} />
                );
        }
    };

    const lastAvailableStep = availableSteps.slice(-1)[0];
    const lastAvailableStepInfo: LastAvailableStepInfo | undefined = lastAvailableStep
        ? {
              route: soknadStepsConfig[lastAvailableStep].route,
              title: soknadStepUtils.getStepTexts(intl, soknadStepsConfig[lastAvailableStep]).stepTitle,
          }
        : undefined;

    return (
        <Switch>
            <Route path={AppRoutes.SOKNAD} exact={true}>
                <VelkommenPage />
            </Route>
            <Route path={AppRoutes.SOKNAD_SENT} exact={true}>
                <LoadWrapper
                    isLoading={isPending(sendSoknadStatus.status) || isInitial(sendSoknadStatus.status)}
                    contentRenderer={() => {
                        if (isSuccess(sendSoknadStatus.status) && <KvitteringPage />) {
                            return <KvitteringPage />;
                        }
                        if (isFailure(sendSoknadStatus.status)) {
                            return <ErrorPage />;
                        }
                        return <div>Det oppstod en feil</div>;
                    }}
                />
            </Route>
            {soknadId === undefined && <Redirect key="redirectToWelcome" to={AppRoutes.SOKNAD} />}
            {soknadId &&
                availableSteps.map((step) => {
                    return (
                        <Route
                            key={step}
                            path={soknadStepsConfig[step].route}
                            exact={true}
                            render={() => renderSoknadStep(søker, barn, step)}
                        />
                    );
                })}
            <Route path="*">
                <ErrorPage
                    contentRenderer={() => (
                        <SoknadErrorMessages.MissingSoknadDataError lastAvailableStep={lastAvailableStepInfo} />
                    )}></ErrorPage>
            </Route>
        </Switch>
    );
};
export default SoknadRoutes;
