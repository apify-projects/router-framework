import { DataValidatorOptions } from '../common/types';
import DataValidator from '../data-validator';

export default function defineDataValidator<InputDataInput, InputDataOutput>(options: DataValidatorOptions<InputDataInput, InputDataOutput>) {
    return new DataValidator<InputDataInput, InputDataOutput>(options);
}
