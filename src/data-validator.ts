import Logger from './logger';
import type { DataSanitizeFn, DataValidateFn, DataValidatorOptions, ValidateResult } from './common/types';

export default class DataValidator<DataValidatorInput = unknown, DataValidatorOutput = unknown> {
    id: string;
    sanitizeHandler: DataSanitizeFn<DataValidatorInput, DataValidatorOutput>;
    validateHandler: DataValidateFn<DataValidatorOutput>;
    log: Logger;

    constructor(options: DataValidatorOptions<DataValidatorInput, DataValidatorOutput>) {
        const { key = 'data-validator', name, sanitize, validate } = options;

        this.id = `${key}${name ? `-${name}` : ''}`;
        this.sanitizeHandler = sanitize || ((input: DataValidatorInput): DataValidatorOutput => (input as unknown as DataValidatorOutput));
        this.validateHandler = validate || ((input: DataValidatorOutput) => ({ valid: true, data: input }));

        this.log = new Logger(this);
    }

    sanitize(rawData: DataValidatorInput): DataValidatorOutput {
        return this.sanitizeHandler(rawData);
    }

    validate(rawData: DataValidatorInput): ValidateResult<DataValidatorOutput> {
        return this.validateHandler(this.sanitizeHandler(rawData));
    }
}
