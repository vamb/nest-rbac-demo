import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common'
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

@Injectable()
export class PrivilegeValidationPipe implements PipeTransform {
    async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value)
    const errors = await validate(object)
    if (errors.length > 0){
      console.log('errors', errors)
      throw new BadRequestException('validation failed')
    }
    return value;
  }

  private toValidate(metaType: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object]
    return !types.includes(metaType)
  }
}