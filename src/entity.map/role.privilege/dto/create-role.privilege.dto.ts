import { IsInt } from "class-validator";

export class CreateRolePrivilegeDto {

  @IsInt()
  roleId: number;

  @IsInt()
  privilegeId: number;
}
