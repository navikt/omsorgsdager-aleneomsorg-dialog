import { hasValue } from '@navikt/sif-common-core/lib/validation/hasValue';
import { AndreBarn, BarnFormValues } from './types';

const isBarn = (barn: Partial<AndreBarn>): barn is AndreBarn => {
    const { fnr, navn } = barn;
    return hasValue(fnr) && hasValue(navn);
};

const mapBarnToFormValues = (barn: Partial<AndreBarn>): BarnFormValues => {
    return {
        fnr: barn.fnr,
        navn: barn.navn,
    };
};

const annetBarnUtils = {
    mapBarnToFormValues,
    isBarn,
};

export default annetBarnUtils;
