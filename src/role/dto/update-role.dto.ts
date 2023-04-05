import { IsArray, IsString } from "class-validator";

export class UpdateRoleDto {
    id: number;

    @IsString()
    name: string;

    @IsString()
    code: string;

    description: string;

    @IsArray()
    privilegeIds: number []
}
