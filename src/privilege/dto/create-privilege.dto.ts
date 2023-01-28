import { IsString, IsInt } from 'class-validator'

export class CreatePrivilegeDto {

  id: number;
  pid: number;

  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsInt()
  type: number;

  @IsString()
  path: string;

  sort: number;
  icon: string;
  createTime: Date;
  createBy: string;
  updateTime: Date;
  updateBy: string;
  level: number;
}
