import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { failure, pending, success } from '@devexperts/remote-data-ts';
import LoadWrapper from '@navikt/sif-common-core/lib/components/load-wrapper/LoadWrapper';
import { isUserLoggedOut } from '@navikt/sif-common-core/lib/utils/apiUtils';
import { SoknadApplicationType } from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepTypes';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';
import { ulid } from 'ulid';
import { sendSoknad } from '../api/sendSoknad';
import AppRoutes, { getRouteUrl } from '../config/routeConfig';
import { Person } from '../types/Person';
import { SoknadApiData } from '../types/SoknadApiData';
import { Barn, SoknadFormData } from '../types/SoknadFormData';
import { SoknadTempStorageData } from '../types/SoknadTempStorageData';
import {
    navigateTo,
    navigateToErrorPage,
    navigateToKvitteringPage,
    relocateToLoginPage,
    relocateToNavFrontpage,
    relocateToSoknad,
} from '../utils/navigationUtils';
import { initialSoknadFormData } from './initialSoknadValues';
import { initialSendSoknadState, SendSoknadStatus, SoknadContextProvider } from './SoknadContext';
import SoknadFormComponents from './SoknadFormComponents';
import SoknadRoutes from './SoknadRoutes';
import { soknadStepsConfig, StepID } from './soknadStepsConfig';
import soknadTempStorage, { isStorageDataValid } from './SoknadTempStorage';
import { ApplikasjonHendelse, useAmplitudeInstance } from '@navikt/sif-common-amplitude';
import { SKJEMANAVN } from '../App';
import { FormikState } from 'formik';

interface Props {
    søker: Person;
    barn: Barn[];
    soknadTempStorage: SoknadTempStorageData;
    route?: string;
}

type resetFormFunc = (nextState?: Partial<FormikState<SoknadFormData>>) => void;

const Soknad = ({ søker, barn, soknadTempStorage: tempStorage }: Props) => {
    const history = useHistory();
    const [initializing, setInitializing] = useState(true);

    const [initialFormData, setInitialFormData] = useState<Partial<SoknadFormData>>({ ...initialSoknadFormData });
    const [sendSoknadStatus, setSendSoknadStatus] = useState<SendSoknadStatus>(initialSendSoknadState);
    const [soknadId, setSoknadId] = useState<string | undefined>();

    const { logSoknadSent, logSoknadStartet, logSoknadFailed, logHendelse, logUserLoggedOut } = useAmplitudeInstance();

    const resetSoknad = async (redirectToFrontpage = true) => {
        await soknadTempStorage.purge();
        setInitialFormData({ ...initialSoknadFormData });
        setSoknadId(undefined);
        if (redirectToFrontpage) {
            if (location.pathname !== getRouteUrl(AppRoutes.SOKNAD)) {
                relocateToSoknad();
                setInitializing(false);
            } else {
                setInitializing(false);
            }
        } else {
            setInitializing(false);
        }
    };

    const abortSoknad = async () => {
        try {
            await soknadTempStorage.purge();
            await logHendelse(ApplikasjonHendelse.avbryt);
            relocateToSoknad();
        } catch (error) {
            if (isUserLoggedOut(error)) {
                logUserLoggedOut('Ved abort av søknad');
                relocateToLoginPage();
            } else {
                console.log('Feil ved abort av søknad: ', error);
                navigateToErrorPage(history);
            }
        }
    };

    const startSoknad = async () => {
        try {
            await resetSoknad();
            const sId = ulid();
            setSoknadId(sId);
            const firstStep = StepID.OM_OMSORGEN_FOR_BARN;

            await soknadTempStorage.create();
            await logSoknadStartet(SKJEMANAVN);

            setTimeout(() => {
                navigateTo(soknadStepUtils.getStepRoute(firstStep, SoknadApplicationType.SOKNAD), history);
            });
        } catch (error) {
            if (isUserLoggedOut(error)) {
                logUserLoggedOut('Ved start av søknad');
                relocateToLoginPage();
            } else {
                console.log('Feil ved start av søknad: ', error);
                navigateToErrorPage(history);
            }
        }
    };

    const continueSoknadLater = async (sId: string, stepID: StepID, values: SoknadFormData) => {
        try {
            await soknadTempStorage.update(sId, values, stepID, { søker, barn });
            await logHendelse(ApplikasjonHendelse.fortsettSenere);
            relocateToNavFrontpage();
        } catch (error) {
            if (isUserLoggedOut(error)) {
                logUserLoggedOut('Ved continueSoknadLater');
                relocateToLoginPage();
            } else {
                console.log('Feil ved continueSoknadLater: ', error);
                navigateToErrorPage(history);
            }
        }
    };

    const onSoknadSent = async (apiValues: SoknadApiData, resetFormikForm: resetFormFunc) => {
        await soknadTempStorage.purge();
        await logSoknadSent(SKJEMANAVN);
        setSendSoknadStatus({ failures: 0, status: success(apiValues) });
        setSoknadId(undefined);
        setInitialFormData({ ...initialSoknadFormData });
        resetFormikForm({ values: initialSoknadFormData });
        navigateToKvitteringPage(history);
    };

    const send = async (apiValues: SoknadApiData, resetForm: resetFormFunc) => {
        try {
            await sendSoknad(apiValues);
            onSoknadSent(apiValues, resetForm);
        } catch (error) {
            if (isUserLoggedOut(error)) {
                logUserLoggedOut('Ved innsending av søknad');
                relocateToLoginPage();
            } else {
                await logSoknadFailed('Ved innsending av søknad');
                if (sendSoknadStatus.failures >= 2) {
                    navigateToErrorPage(history);
                } else {
                    setSendSoknadStatus({
                        failures: sendSoknadStatus.failures + 1,
                        status: failure(error),
                    });
                }
            }
        }
    };

    const triggerSend = (apiValues: SoknadApiData, resetForm: resetFormFunc) => {
        setTimeout(() => {
            setSendSoknadStatus({ ...sendSoknadStatus, status: pending });
            setTimeout(() => {
                send(apiValues, resetForm);
            });
        });
    };

    useEffect(() => {
        if (isStorageDataValid(tempStorage, { søker, barn })) {
            setInitialFormData(tempStorage.formData);
            setSoknadId(tempStorage.metadata.soknadId);
            const currentRoute = history.location.pathname;
            const lastStepRoute = soknadStepUtils.getStepRoute(
                tempStorage.metadata.lastStepID,
                SoknadApplicationType.SOKNAD
            );
            if (currentRoute !== lastStepRoute) {
                setTimeout(() => {
                    navigateTo(
                        soknadStepUtils.getStepRoute(tempStorage.metadata.lastStepID, SoknadApplicationType.SOKNAD),
                        history
                    );
                    setInitializing(false);
                });
            } else {
                setInitializing(false);
            }
        } else {
            resetSoknad(history.location.pathname !== AppRoutes.SOKNAD);
        }
    }, [history, tempStorage, søker, barn]);

    return (
        <LoadWrapper
            isLoading={initializing}
            contentRenderer={() => {
                return (
                    <SoknadFormComponents.FormikWrapper
                        initialValues={initialFormData}
                        onSubmit={() => null}
                        renderForm={({ values, resetForm }) => {
                            const navigateToNextStepFromStep = async (stepID: StepID) => {
                                const stepToPersist = soknadStepsConfig[stepID].nextStep;
                                if (stepToPersist && soknadId) {
                                    try {
                                        await soknadTempStorage.update(soknadId, values, stepToPersist, {
                                            søker,
                                            barn,
                                        });
                                    } catch (error) {
                                        if (isUserLoggedOut(error)) {
                                            await logUserLoggedOut('ved mellomlagring');
                                            relocateToLoginPage();
                                        }
                                    }
                                }
                                const step = soknadStepsConfig[stepID];
                                setTimeout(() => {
                                    if (step.nextStepRoute) {
                                        navigateTo(step.nextStepRoute, history);
                                    }
                                });
                            };

                            return (
                                <SoknadContextProvider
                                    value={{
                                        soknadId,
                                        soknadStepsConfig,
                                        sendSoknadStatus,
                                        resetSoknad: abortSoknad,
                                        continueSoknadLater: soknadId
                                            ? (stepId) => continueSoknadLater(soknadId, stepId, values)
                                            : undefined,
                                        startSoknad,
                                        sendSoknad: (apiValues) => triggerSend(apiValues, resetForm),
                                        gotoNextStepFromStep: (stepID: StepID) => {
                                            navigateToNextStepFromStep(stepID);
                                        },
                                    }}>
                                    <SoknadRoutes soknadId={soknadId} søker={søker} barn={barn} />
                                </SoknadContextProvider>
                            );
                        }}
                    />
                );
            }}
        />
    );
};

export default Soknad;
