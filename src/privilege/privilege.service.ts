import { Injectable, BadRequestException } from '@nestjs/common';
import { CreatePrivilegeDto } from './dto/create-privilege.dto';
import { UpdatePrivilegeDto } from './dto/update-privilege.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Connection } from "typeorm";
import { PrivilegeEntity } from "./entities/privilege.entity";
import { PaginationDto } from "../common/dto/pagination.dto";
import { PaginationPrivilegeDto } from "./dto/pagination-privilege.dto";

@Injectable()
export class PrivilegeService {
  constructor(
    @InjectRepository(PrivilegeEntity)
    private privilegeRepository: Repository<PrivilegeEntity>,
    private connection: Connection
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<PaginationPrivilegeDto> {
    const skippedItems = (paginationDto.page - 1) * paginationDto.size

    const totalCount = await this.privilegeRepository.count()
    const privileges = await this.privilegeRepository.createQueryBuilder()
      .orderBy('id', 'ASC')
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

  findOne(id: number) {
    // return `This action returns a #${id} privilege`;
    const rest = this.connection.createQueryBuilder()
      .select('privilege')
      .from(PrivilegeEntity, 'privilege')
      .where('privilege.id = :id', { id: id })
      .getOne();
    return rest
  }

  update(id: number, updatePrivilegeDto: UpdatePrivilegeDto) {
    return `This action updates a #${id} privilege`;
  }

  async remove(id: number) {
    // return `This action removes a #${id} privilege`;
    await this.privilegeRepository.delete(id)
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
