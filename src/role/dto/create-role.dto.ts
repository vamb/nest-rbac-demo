import { IsString, IsArray } from "class-validator";

export class CreateRoleDto {

  id: number;

  @IsString()
  name: string;

  @IsString()
  code: string;

  description: string;

  @IsArray()
  privilegeIds: number []
}
