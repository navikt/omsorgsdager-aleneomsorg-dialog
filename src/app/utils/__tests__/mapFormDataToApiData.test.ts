/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
    Barn,
    TidspunktForAleneomsorgFormData,
    AleneomsorgTidspunkt,
    SoknadFormData,
    SoknadFormField,
} from '../../types/SoknadFormData';
import { AndreBarn } from '../../pre-common/forms/barn/types';
import { SoknadApiData } from '../../types/SoknadApiData';
import { mapFormDataToApiData } from '../map-form-data-to-api-data/mapFormDataToApiData';

const barnsFødselsdato = new Date(2021, 0, 20);
const registrerteBarnMock: Barn[] = [
    { fødselsdato: barnsFødselsdato, fornavn: 'Mock', etternavn: 'Mocknes', aktørId: '84589' },
];
const andreBarnMock: AndreBarn[] = [{ id: '676478', navn: 'Jack ONeil', fnr: '18058522232' }];
const aleneomsorgTidspunkt: AleneomsorgTidspunkt[] = [
    {
        fnrId: '18058522232',
        tidspunktForAleneomsorg: TidspunktForAleneomsorgFormData.SISTE_2_ÅRENE,
        dato: '2021-04-15',
    },
    { fnrId: '84589', tidspunktForAleneomsorg: TidspunktForAleneomsorgFormData.TIDLIGERE },
];
const harAleneomsorgFor = ['84589', '18058522232'];
const formDataMock: SoknadFormData = {
    [SoknadFormField.harForståttRettigheterOgPlikter]: true,
    [SoknadFormField.harBekreftetOpplysninger]: true,
    [SoknadFormField.andreBarn]: andreBarnMock,
    [SoknadFormField.harAleneomsorgFor]: harAleneomsorgFor,
    [SoknadFormField.aleneomsorgTidspunkt]: aleneomsorgTidspunkt,
};

describe('mapFormDataToApiData', () => {
    let resultingApiData: SoknadApiData;

    beforeAll(() => {
        resultingApiData = mapFormDataToApiData('nb', formDataMock, registrerteBarnMock)!;
    });

    it('ckeck mapFormDataToApiData is defined', () => {
        expect(resultingApiData).toBeDefined();
    });

    it('ckeck language', () => {
        expect(resultingApiData.språk).toEqual('nb');
    });

    it('ckeck harForståttRettigheterOgPlikter', () => {
        expect(resultingApiData.harForståttRettigheterOgPlikter).toBe(
            formDataMock[SoknadFormField.harForståttRettigheterOgPlikter]
        );
    });

    it('ckeck harBekreftetOpplysninger', () => {
        expect(resultingApiData.harBekreftetOpplysninger).toBe(formDataMock[SoknadFormField.harBekreftetOpplysninger]);
    });

    it('ckeck array length', () => {
        expect(resultingApiData.barn.length).toBe(2);
    });
});
