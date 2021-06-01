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
    mapAndreBarnToBarnMedAleneomsorg,
    mapRegistrerteBarnToBarnMedAleneomsorg,
} from '../../utils/tidspunktForAleneomsorgUtils';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import TidspunktForBarn from '../../components/TidspunktForBarn';

interface Props {
    barn: Barn[];
}

const TidspunktForAleneomsorgStep = ({ barn }: Props) => {
    const { values } = useFormikContext<SoknadFormData>();
    const { andreBarn, harAleneomsorgFor } = values;

    const andreBarnMedAleneomsorg = andreBarn.filter((b) => barnFinnesIArray(b.fnr, harAleneomsorgFor));
    const registrerteBarnMedAleneOmsorg = barn.filter((b) => barnFinnesIArray(b.aktørId, harAleneomsorgFor));

    const barnMedAleneomsorg: BarnMedAleneomsorg[] = [
        ...andreBarnMedAleneomsorg.map((barn) => mapAndreBarnToBarnMedAleneomsorg(barn)),
        ...registrerteBarnMedAleneOmsorg.map((barn) => mapRegistrerteBarnToBarnMedAleneomsorg(barn)),
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
            <CounsellorPanel>
                <p>TEKST HER</p>
            </CounsellorPanel>
            <p>Oppgi tidspunkt for når du ble alene om omsorgen</p>

            {barnMedAleneomsorg.map((barnMedAleneomsorg) => {
                return (
                    <FormBlock key={barnMedAleneomsorg.idFnr}>
                        <TidspunktForBarn barnMedAleneomsorg={barnMedAleneomsorg} />
                    </FormBlock>
                );
            })}
        </SoknadFormStep>
    );
};

export default TidspunktForAleneomsorgStep;
