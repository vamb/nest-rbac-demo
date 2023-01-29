import { Injectable, BadRequestException } from '@nestjs/common';
import { CreatePrivilegeDto } from './dto/create-privilege.dto';
import { UpdatePrivilegeDto } from './dto/update-privilege.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Connection } from "typeorm";
import { PrivilegeEntity } from "./entities/privilege.entity";
import { PaginationDto } from "../common/dto/pagination.dto";
import { PaginationPrivilegeDto } from "./dto/pagination-privilege.dto";
import { getSkippedItems } from "../common/utils/utils";

@Injectable()
export class PrivilegeService {
  constructor(
    @InjectRepository(PrivilegeEntity)
    private privilegeRepository: Repository<PrivilegeEntity>,
    private connection: Connection
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<PaginationPrivilegeDto> {
    const skippedItems = getSkippedItems(paginationDto)

    const totalCount = await this.privilegeRepository.count()
    const privileges = await this.privilegeRepository.createQueryBuilder()
      .orderBy('id', 'DESC')
      .offset(skippedItems)
      .limit(paginationDto.size)
      .getMany()

    return {
      totalCount,
      page: paginationDto.page,
      size: paginationDto.size,
      list: privileges
    }
  }

  async findOne(id: number) {
    // return `This action returns a #${id} privilege`;
    const rest = await this.connection.createQueryBuilder()
      .select('privilege')
      .from(PrivilegeEntity, 'privilege')
      .where('privilege.id = :id', { id: id })
      .getOne();
    return rest
  }

  async checkCanUpdate(id: number, updatePrivilegeDto: UpdatePrivilegeDto) {
    const queryArray = []
    if(updatePrivilegeDto.name) {
      queryArray.push({paramName: 'name', paramValue: updatePrivilegeDto.name})
    }
    if(updatePrivilegeDto.code) {
      queryArray.push({paramName: 'code', paramValue: updatePrivilegeDto.code})
    }
    if(updatePrivilegeDto.path) {
      queryArray.push({paramName: 'path', paramValue: updatePrivilegeDto.path})
    }

    let whereQueryStr = ''
    let whereQueryObj = {}

    if(Array.isArray(queryArray) && queryArray.length>0){
      queryArray.map(item=>{
        whereQueryStr = whereQueryStr + ` privilege.${item.paramName} = :${item.paramName} or `
        whereQueryObj = {...whereQueryObj, ...{[item.paramName]: item.paramValue}}
      })
    }
    whereQueryStr = whereQueryStr + ' privilege.id != :id '
    whereQueryObj = {...whereQueryObj, ...{id: id}}

    const rest = await this.connection.createQueryBuilder()
      .select('privilege')
      .from(PrivilegeEntity, 'privilege')
      .where(whereQueryStr, whereQueryObj)
      .getOne()
    return rest
  }

  // 增量更新
  async patchUpdate(id: number, updatePrivilegeDto: UpdatePrivilegeDto, currUserEmail: string) {
    const newDate = new Date()
    const targetObj = await this.findOne(id)
    if(targetObj){
      const ifExist = await this.checkCanUpdate(id, updatePrivilegeDto)
      if(ifExist){
        throw new BadRequestException(
          `Request data duplicate code: ${updatePrivilegeDto.code}, name: ${updatePrivilegeDto.name}, path: ${updatePrivilegeDto.path}, id: ${id}`
        )
      }
      return await this.privilegeRepository.createQueryBuilder()
        .update()
        .set({
          pid: updatePrivilegeDto.pid || targetObj.pid,
          name: updatePrivilegeDto.name || targetObj.name,
          code: updatePrivilegeDto.code || targetObj.code,
          type: updatePrivilegeDto.type || targetObj.type,
          path: updatePrivilegeDto.path || targetObj.path,
          sort: updatePrivilegeDto.sort || targetObj.sort,
          icon: updatePrivilegeDto.icon || targetObj.icon,
          updateTime: newDate,
          updateBy: currUserEmail
        })
      .where("id = :id", {id: id})
      .execute()
    }else{
      throw new BadRequestException(`Can not find data, id: ${id}`)
    }
  }

  // 全量更新
  async putUpdate(id: number, updatePrivilegeDto: UpdatePrivilegeDto, currUserEmail: string) {
    if(!updatePrivilegeDto?.name){
      throw new BadRequestException(`name can not be null`)
    }else if(!updatePrivilegeDto?.code){
      throw new BadRequestException(`code can not be null`)
    }else if(!updatePrivilegeDto?.path){
      throw new BadRequestException(`path can not be null`)
    }

    const newDate = new Date()
    const targetObj = await this.findOne(id)
    if(targetObj){
      const ifExist = await this.checkCanUpdate(id, updatePrivilegeDto)
      if(ifExist){
        throw new BadRequestException(
          `Request data duplicate code: ${updatePrivilegeDto.code}, name: ${updatePrivilegeDto.name}, path: ${updatePrivilegeDto.path}, id: ${id}`
        )
      }
      return await this.privilegeRepository.createQueryBuilder()
        .update()
        .set({
          pid: updatePrivilegeDto.pid,
          name: updatePrivilegeDto.name,
          code: updatePrivilegeDto.code,
          type: updatePrivilegeDto.type,
          path: updatePrivilegeDto.path,
          sort: updatePrivilegeDto.sort,
          icon: updatePrivilegeDto.icon,
          updateTime: newDate,
          updateBy: currUserEmail
        })
        .where("id = :id", {id: id})
        .execute()
    }else{
      throw new BadRequestException(`Can not find data, id: ${id}`)
    }
  }

  async remove(id: number) {
    const targetObj = await this.findOne(id)
    if(targetObj){
      await this.privilegeRepository.delete(id)
    }else{
      throw new BadRequestException(`this data is not exist id: ${id}`)
    }
  }

  async findByNameOrCodeOrPath(createPrivilegeDto: CreatePrivilegeDto){
    const queryObj = await this.privilegeRepository.createQueryBuilder()
      .select('privilege')
      .from(PrivilegeEntity, 'privilege')
      .where('privilege.name = :name or privilege.code = :code or privilege.path = :path',
        {name: createPrivilegeDto.name, code: createPrivilegeDto.code, path: createPrivilegeDto.path})
      .getOne()
    return queryObj
  }

  async savePrivilege(dto: CreatePrivilegeDto, email: string) {
    const ifExist = await this.findByNameOrCodeOrPath(dto)
    if(ifExist){
      throw new BadRequestException(
        `Request data duplicate code: ${dto.code}, name: ${dto.name}, path: ${dto.path}`)
    }

    const newDate = new Date()
    const privilegeEntity: PrivilegeEntity = {
      id:  dto.id,
      pid: dto.pid,
      name: dto.name,
      code: dto.code,
      type: dto.type,
      path: dto.path,
      sort: dto.sort || 0,
      icon: dto.icon,
      createTime: dto.createTime || newDate,
      createBy: dto.createBy || email,
      updateTime: dto.updateTime || newDate,
      updateBy: dto.updateBy || email,
      level: dto.level
    }
    return await this.privilegeRepository.createQueryBuilder()
      .insert()
      .into(PrivilegeEntity)
      .values([privilegeEntity])
      .execute()
  }
}
