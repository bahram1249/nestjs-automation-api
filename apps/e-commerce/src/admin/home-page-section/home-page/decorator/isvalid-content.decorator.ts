import { registerDecorator, ValidationOptions } from 'class-validator';
import { CustomContentValidator } from '../custom-validator';

export function isValidContent(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: CustomContentValidator,
    });
  };
}
