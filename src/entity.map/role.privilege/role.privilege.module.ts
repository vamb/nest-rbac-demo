import { Module } from '@nestjs/common';
import { RolePrivilegeService } from './role.privilege.service';
import { RolePrivilegeController } from './role.privilege.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolePrivilegeEntity } from "./entities/role.privilege.entity";

@Module({
  imports: [TypeOrmModule.forFeature([RolePrivilegeEntity])],
  controllers: [RolePrivilegeController],
  providers: [RolePrivilegeService],
  exports: [RolePrivilegeService, TypeOrmModule]
})
export class RolePrivilegeModule {}
