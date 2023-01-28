import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Repository, Connection, EntityManager } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { RoleEntity } from "./entities/role.entity";
import { RolePrivilegeEntity } from "../entity.map/role.privilege/entities/role.privilege.entity";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    private connection: Connection,
    private entityManager: EntityManager,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  findAll() {
    return `This action returns all role`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }

  async findRoleByCodeOrName(createRoleDto: CreateRoleDto) {
    const queryRole = await this.roleRepository.createQueryBuilder()
      .select('role')
      .from(RoleEntity, 'role')
      .where("role.code = :code or role.name = :name ",
        {code: createRoleDto.code, name: createRoleDto.name})
      .getOne()
    return queryRole
  }

  async saveRole(createRoleDto: CreateRoleDto, request) {
    const newDate = new Date()
    const currentUser = request.user

    const roleEntity: RoleEntity = {
      id: createRoleDto.id,
      code: createRoleDto.code,
      name: createRoleDto.name,
      description: createRoleDto.description,
      createTime: newDate,
      createBy: currentUser.email,
      updateTime: newDate,
      updateBy: currentUser.email
    }

    const ifExistRole = await this.findRoleByCodeOrName(createRoleDto)
    if(ifExistRole){
      throw new BadRequestException(
        `Request data duplicate code: ${createRoleDto.code}, name: ${createRoleDto.name}`)
    }

    const roleRepo = this.entityManager.getRepository(RoleEntity)
    const rolePrivilegeRepo = this.entityManager.getRepository(RolePrivilegeEntity)

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let saveResult = false

    try{
      let roleRest = await queryRunner.manager.save(roleRepo.create(roleEntity))
      await createRoleDto.privilegeIds.map(async (privilegeId: number)=>{
        const rolePrivilegeEntity: RolePrivilegeEntity = {
          id: null,
          roleId: roleRest?.id,
          privilegeId: privilegeId
        }
        await queryRunner.manager.save(rolePrivilegeRepo.create(rolePrivilegeEntity))
      })
      await queryRunner.commitTransaction()
      saveResult = true
    }catch (error) {
      // 如果遇到错误，可以回滚事务
      saveResult = false
      await queryRunner.rollbackTransaction()
    } finally {
      //你需要手动实例化并部署一个queryRunner
      await queryRunner.release()
    }
    return saveResult
  }
}
