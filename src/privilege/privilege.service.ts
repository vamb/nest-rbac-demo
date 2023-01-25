import { Injectable } from '@nestjs/common';
import { CreatePrivilegeDto } from './dto/create-privilege.dto';
import { UpdatePrivilegeDto } from './dto/update-privilege.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Connection } from "typeorm";
import { PrivilegeEntity } from "./entities/privilege.entity";

@Injectable()
export class PrivilegeService {
  constructor(
    @InjectRepository(PrivilegeEntity)
    private privilegeRepository: Repository<PrivilegeEntity>,
    private connection: Connection
  ) {}

  create(createPrivilegeDto: CreatePrivilegeDto) {
    return 'This action adds a new privilege';
  }

  findAll() {
    return `This action returns all privilege`;
  }

  findOne(id: number) {
    return `This action returns a #${id} privilege`;
  }

  update(id: number, updatePrivilegeDto: UpdatePrivilegeDto) {
    return `This action updates a #${id} privilege`;
  }

  remove(id: number) {
    return `This action removes a #${id} privilege`;
  }

  async savePrivilege(createPrivilegeDto: CreatePrivilegeDto, email: string) {
    const newDate = new Date()
    const privilegeEntity: PrivilegeEntity = {
      id:  createPrivilegeDto.id,
      pid: createPrivilegeDto.pid,
      name: createPrivilegeDto.name,
      code: createPrivilegeDto.code,
      type: createPrivilegeDto.type,
      path: createPrivilegeDto.path,
      sort: createPrivilegeDto.sort || 0,
      icon: createPrivilegeDto.icon,
      createTime: createPrivilegeDto.createTime || newDate,
      createBy: createPrivilegeDto.createBy || email,
      updateTime: createPrivilegeDto.updateTime || newDate,
      updateBy: createPrivilegeDto.updateBy || email,
      level: createPrivilegeDto.level
    }
    return await this.privilegeRepository.createQueryBuilder()
      .insert()
      .into(PrivilegeEntity)
      .values([privilegeEntity])
      .execute()
  }
}
