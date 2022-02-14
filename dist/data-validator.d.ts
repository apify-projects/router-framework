import Logger from './logger';
import type { DataSanitizeFn, DataValidateFn, DataValidatorOptions, ValidateResult } from './common/types';
export default class DataValidator<DataValidatorInput = unknown, DataValidatorOutput = unknown> {
    id: string;
    sanitizeHandler: DataSanitizeFn<DataValidatorInput, DataValidatorOutput>;
    validateHandler: DataValidateFn<DataValidatorOutput>;
    log: Logger;
    constructor(options: DataValidatorOptions<DataValidatorInput, DataValidatorOutput>);
    sanitize(rawData: DataValidatorInput): DataValidatorOutput;
    validate(rawData: DataValidatorInput): ValidateResult<DataValidatorOutput>;
}
//# sourceMappingURL=data-validator.d.ts.map