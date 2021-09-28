/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
    Barn,
    TidspunktForAleneomsorgFormData,
    AleneomsorgTidspunkt,
    SoknadFormData,
    SoknadFormField,
} from '../../types/SoknadFormData';
import { ApiBarn, SoknadApiData, TidspunktForAleneomsorgApi } from '../../types/SoknadApiData';
import { mapFormDataToApiData } from '../map-form-data-to-api-data/mapFormDataToApiData';

const barnsFødselsdato = new Date(2021, 0, 20);
const registrerteBarnMock: Barn[] = [
    { fødselsdato: barnsFødselsdato, fornavn: 'Mock', etternavn: 'Mocknes', aktørId: '84589' },
    { fødselsdato: barnsFødselsdato, fornavn: 'Mock2', etternavn: 'Mocknes2', aktørId: '87857' },
];
const aleneomsorgTidspunkt: AleneomsorgTidspunkt[] = [
    {
        fnrId: '18058522232',
        tidspunktForAleneomsorg: TidspunktForAleneomsorgFormData.SISTE_2_ÅRENE,
        dato: '2021-04-15',
    },
    { fnrId: '84589', tidspunktForAleneomsorg: TidspunktForAleneomsorgFormData.TIDLIGERE },
    { fnrId: '87857', tidspunktForAleneomsorg: TidspunktForAleneomsorgFormData.TIDLIGERE, dato: '2021-03-12' },
];
const harAleneomsorgFor = ['84589', '87857', '18058522232'];

const mockApiBarn: ApiBarn[] = [
    {
        navn: 'Mock Mocknes',
        aktørId: '84589',
        tidspunktForAleneomsorg: TidspunktForAleneomsorgApi.TIDLIGERE,
        dato: undefined,
    },
    {
        navn: 'Mock2 Mocknes2',
        aktørId: '87857',
        tidspunktForAleneomsorg: TidspunktForAleneomsorgApi.TIDLIGERE,
        dato: undefined,
    },
];
const formDataMock: SoknadFormData = {
    [SoknadFormField.harForståttRettigheterOgPlikter]: true,
    [SoknadFormField.harBekreftetOpplysninger]: true,
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

    it('ckeck map to ApiBarn', () => {
        expect(resultingApiData.barn).toEqual(mockApiBarn);
    });
});
