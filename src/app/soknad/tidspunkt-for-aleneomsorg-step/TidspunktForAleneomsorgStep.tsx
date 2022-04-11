import React from 'react';
import { useFormikContext } from 'formik';
import {
    AleneomsorgTidspunkt,
    AleneomsorgTidspunktField,
    Barn,
    SoknadFormData,
    TidspunktForAleneomsorgFormData,
} from '../../types/SoknadFormData';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import {
    barnFinnesIArray,
    BarnMedAleneomsorg,
    mapAnnetBarnToBarnMedAleneomsorg,
    mapRegistrerteBarnToBarnMedAleneomsorg,
} from '../../utils/tidspunktForAleneomsorgUtils';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import TidspunktForBarn from '../../components/TidspunktForBarn';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import Box from '@navikt/sif-common-core/lib/components/box/Box';

interface Props {
    barn: Barn[];
}

const TidspunktForAleneomsorgStep = ({ barn }: Props) => {
    const intl = useIntl();
    const { values } = useFormikContext<SoknadFormData>();
    const { harAleneomsorgFor } = values;

    const registrerteBarnMedAleneOmsorg = barn.filter((b) => barnFinnesIArray(b.aktørId, harAleneomsorgFor));
    const annetBarnMedAleneOmsorg = values.annetBarn
        ? values.annetBarn.filter((b) => barnFinnesIArray(b.fnr, harAleneomsorgFor))
        : [];

    const barnMedAleneomsorg: BarnMedAleneomsorg[] = [
        ...registrerteBarnMedAleneOmsorg.map((barn) => mapRegistrerteBarnToBarnMedAleneomsorg(barn)),
        ...annetBarnMedAleneOmsorg.map((barn) => mapAnnetBarnToBarnMedAleneomsorg(barn)),
    ];

    const getFieldName = (key: string, fieldName: AleneomsorgTidspunktField): string => {
        return `${fieldName}_${key}`;
    };

    const cleanupStep = (formData: SoknadFormData): SoknadFormData => {
        const aleneomsorgTidspunkt: AleneomsorgTidspunkt[] = [];

        formData.harAleneomsorgFor.forEach((fnrId) => {
            const fieldNameFnr = getFieldName(fnrId, AleneomsorgTidspunktField.tidspunktForAleneomsorg);

            aleneomsorgTidspunkt.push({
                fnrId: fnrId,
                tidspunktForAleneomsorg: formData[fieldNameFnr],
                dato:
                    formData[fieldNameFnr] === TidspunktForAleneomsorgFormData.SISTE_2_ÅRENE
                        ? formData[getFieldName(fnrId, AleneomsorgTidspunktField.dato)]
                        : undefined,
            });
        });
        formData.aleneomsorgTidspunkt = aleneomsorgTidspunkt;
        return formData;
    };

    return (
        <SoknadFormStep id={StepID.TIDSPUNKT_FOR_ALENEOMSORG} onStepCleanup={cleanupStep}>
            <CounsellorPanel switchToPlakatOnSmallScreenSize={true}>
                {intlHelper(intl, 'step.tidspunkt-for-aleneomsorg.stepIntro')}
            </CounsellorPanel>

            <Box margin="xl" padBottom="xl">
                {barnMedAleneomsorg.map((barnMedAleneomsorg) => {
                    return (
                        <FormBlock key={barnMedAleneomsorg.idFnr}>
                            <TidspunktForBarn barnMedAleneomsorg={barnMedAleneomsorg} />
                        </FormBlock>
                    );
                })}
            </Box>
        </SoknadFormStep>
    );
};

export default TidspunktForAleneomsorgStep;
