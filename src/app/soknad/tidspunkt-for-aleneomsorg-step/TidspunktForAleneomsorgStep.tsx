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
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
// import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
// import { CheckboksPanelProps } from 'nav-frontend-skjema';
import { AndreBarn } from '../../pre-common/question-visibility/forms/barn';
// import SoknadFormComponents from '../SoknadFormComponents';

import FormikTidspunkt from '../../components/FormikTidspunkt';

interface Props {
    barn: Barn[];
}

export interface BarnMedAleneomsorg {
    idFnr: string;
    navn: string;
}
export const barnFinnesIkkeIArray = (barnId: string, idArray: string[]): boolean => {
    return (idArray || []).find((id) => id === barnId) !== undefined;
};

export const mapAndreBarnToBarnMedAleneomsorg = (andreBarn: AndreBarn): BarnMedAleneomsorg => {
    return {
        idFnr: andreBarn.fnr,
        navn: andreBarn.navn,
    };
};

export const mapRegistrerteBarnToBarnMedAleneomsorg = (registrertBarn: Barn): BarnMedAleneomsorg => {
    return {
        idFnr: registrertBarn.aktørId,
        navn: formatName(registrertBarn.fornavn, registrertBarn.etternavn, registrertBarn.mellomnavn),
    };
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
    console.log(barnMedAleneomsorg);
    console.log(values);
    return (
        <SoknadFormStep id={StepID.TIDSPUNKT_FOR_ALENEOMSORG}>
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
