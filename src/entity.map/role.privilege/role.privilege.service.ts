import { Injectable } from '@nestjs/common';
import { CreateRolePrivilegeDto } from './dto/create-role.privilege.dto';
import { UpdateRolePrivilegeDto } from './dto/update-role.privilege.dto';
import { RolePrivilegeEntity } from "./entities/role.privilege.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Connection } from "typeorm";

@Injectable()
export class RolePrivilegeService {
  constructor(
    @InjectRepository(RolePrivilegeEntity)
    private rolePrivilegeRepository: Repository<RolePrivilegeEntity>,
    private connection: Connection
  ) {}

  create(createRolePrivilegeDto: CreateRolePrivilegeDto) {
    return 'This action adds a new rolePrivilege';
  }

  findAll() {
    return `This action returns all rolePrivilege`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rolePrivilege`;
  }

  update(id: number, updateRolePrivilegeDto: UpdateRolePrivilegeDto) {
    return `This action updates a #${id} rolePrivilege`;
  }

  remove(id: number) {
    return `This action removes a #${id} rolePrivilege`;
  }

  async createRolePrivilegeMap(createRolePrivilegeDto: CreateRolePrivilegeDto,) {
    const rolePrivilegeEntity: RolePrivilegeEntity = {
      id: null,
      roleId: createRolePrivilegeDto.roleId,
      privilegeId: createRolePrivilegeDto.privilegeId,
    }
    return await this.rolePrivilegeRepository.createQueryBuilder()
      .insert()
      .into(RolePrivilegeEntity)
      .values([rolePrivilegeEntity])
      .execute()
  }
}
