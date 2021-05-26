import React from 'react';
// import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
//import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useFormikContext } from 'formik';
//import AlertStripe from 'nav-frontend-alertstriper';
// import { Barn, SoknadFormData, SoknadFormField, TidspunktForAleneomsorgFormData } from '../../types/SoknadFormData';
import { Barn, SoknadFormData } from '../../types/SoknadFormData';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import Box from '@navikt/sif-common-core/lib/components/box/Box';

// import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
// import { CheckboksPanelProps } from 'nav-frontend-skjema';

// import SoknadFormComponents from '../SoknadFormComponents';

import FormikTidspunkt from '../../components/FormikTidspunkt';
import {
    barnFinnesIkkeIArray,
    BarnMedAleneomsorg,
    mapAndreBarnToBarnMedAleneomsorg,
    mapRegistrerteBarnToBarnMedAleneomsorg,
} from '../../utils/tidspunktForAleneomsorgUtils';
import { barnFinnesIArray } from '../../utils/map-form-data-to-api-data/mapBarnToApiData';

interface Props {
    barn: Barn[];
}

export const cleanupTidspunktForAleneomsorgStep = (formValues: SoknadFormData): SoknadFormData => {
    const values: SoknadFormData = { ...formValues };

    values.aleneomsorgTidspunkt = values.aleneomsorgTidspunkt.filter((b) =>
        barnFinnesIArray(b.fnrId, values.harAleneomsorgFor)
    );

    return values;
};

const TidspunktForAleneomsorgStep = ({ barn }: Props) => {
    // const intl = useIntl();
    const { values } = useFormikContext<SoknadFormData>();
    const { andreBarn, harAleneomsorgFor } = values;

    const andreBarnMedAleneomsorg = andreBarn.filter((b) => barnFinnesIkkeIArray(b.fnr, harAleneomsorgFor));
    const registrerteBarnMedAleneOmsorg = barn.filter((b) => barnFinnesIkkeIArray(b.aktørId, harAleneomsorgFor));

    const barnMedAleneomsorg: BarnMedAleneomsorg[] = [
        ...andreBarnMedAleneomsorg.map((barn) => mapAndreBarnToBarnMedAleneomsorg(barn)),
        ...registrerteBarnMedAleneOmsorg.map((barn) => mapRegistrerteBarnToBarnMedAleneomsorg(barn)),
    ];

    return (
        <SoknadFormStep id={StepID.TIDSPUNKT_FOR_ALENEOMSORG} onStepCleanup={cleanupTidspunktForAleneomsorgStep}>
            <CounsellorPanel>
                <p>TEKST HER</p>
            </CounsellorPanel>
            <p>Oppgi tidspunkt for når du ble alene om omsorgen</p>
            {barnMedAleneomsorg.length > 0 && (
                <Box margin="xl">
                    {barnMedAleneomsorg.map((value, index) => (
                        <FormikTidspunkt barnMedAleneomsorg={value} index={index} key={index} />
                    ))}
                </Box>
            )}
        </SoknadFormStep>
    );
};

export default TidspunktForAleneomsorgStep;
