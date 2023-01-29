import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Repository, Connection, EntityManager } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { RoleEntity } from "./entities/role.entity";
import { RolePrivilegeEntity } from "../entity.map/role.privilege/entities/role.privilege.entity";
import { PaginationDto } from "../common/dto/pagination.dto";
import { getSkippedItems } from "../common/utils/utils";

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

  async findAll(paginationDto: PaginationDto) {
    const skippedItems = getSkippedItems(paginationDto)

    const totalCount = await this.roleRepository.count()
    const roles = await this.roleRepository.createQueryBuilder()
      .orderBy('id', 'DESC')
      .offset(skippedItems)
      .limit(paginationDto.size)
      .getMany()

    return {
      totalCount,
      page: paginationDto.page,
      size: paginationDto.size,
      list: roles
    }
  }

  async findOne(id: number) {
    return await this.roleRepository.createQueryBuilder()
      .select('role')
      .from(RoleEntity, 'role')
      .where('role.id = :id', {id: id})
      .getOne()
  }

  checkCanUpdate = async (id: number, updateRoleDto: UpdateRoleDto) => {
    const queryArray = []
    if(updateRoleDto.name) {
      queryArray.push({paramName: 'name', paramValue: updateRoleDto.name})
    }
    if(updateRoleDto.code) {
      queryArray.push({paramName: 'code', paramValue: updateRoleDto.code})
    }

    let whereQueryStr = ''
    let whereQueryObj = {}

    if(Array.isArray(queryArray) && queryArray.length>0){
      queryArray.map(item=>{
        whereQueryStr = whereQueryStr + ` role.${item.paramName} = :${item.paramName} or `
        whereQueryObj = {...whereQueryObj, ...{[item.paramName]: item.paramValue}}
      })
    }
    whereQueryStr = whereQueryStr + ` role.id !=:id `
    whereQueryObj = {...whereQueryObj, ...{id: id}}

    const rest = await this.roleRepository.createQueryBuilder()
      .select('role')
      .from(RoleEntity, 'role')
      .where(whereQueryStr, whereQueryObj)
      .getOne()
    return rest
  }

  // 增量更新
  async patchUpdate(id: number, updateRoleDto: UpdateRoleDto, currUserEmail: string) {
    const targetRole = await this.findOne(id)
    if(targetRole){
      const isExist = await this.checkCanUpdate(id, updateRoleDto)
      if(isExist){
        throw new BadRequestException(`Request data is duplicated with existing one`)
      }
      return `This action patch updates a #${id} role ${currUserEmail}`;
    }else{
      throw new BadRequestException(`this data is not exist id: ${id}`)
    }
  }

  // 全量更新
  async putUpdate(id: number, updateRoleDto: UpdateRoleDto, currUserEmail: string) {
    const targetRole = await this.findOne(id)
    if(targetRole){
      return `This action put updates a #${id} role`;
    }else{
      throw new BadRequestException(`this data is not exist id: ${id}`)
    }
  }

  async remove(id: number) {
    const targetObj = await this.findOne(id)
    if(targetObj){
      await this.roleRepository.delete(id)
    }else{
      throw new BadRequestException(`this data is not exist id: ${id}`)
    }
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
