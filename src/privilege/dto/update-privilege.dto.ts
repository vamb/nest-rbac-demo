import { PartialType } from '@nestjs/mapped-types';
import { CreatePrivilegeDto } from './create-privilege.dto';

export class UpdatePrivilegeDto extends PartialType(CreatePrivilegeDto) {
  id: number;
  pid: number
  name: string;
  code: string;
  type: number;
  path: string;
  sort: number;
  icon: string;
}
