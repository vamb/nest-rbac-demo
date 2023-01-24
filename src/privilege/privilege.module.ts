import { Module } from '@nestjs/common';
import { PrivilegeService } from './privilege.service';
import { PrivilegeController } from './privilege.controller';
import { PrivilegeEntity } from "./entities/privilege.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([PrivilegeEntity])],
  controllers: [PrivilegeController],
  providers: [PrivilegeService],
  exports: [PrivilegeService, TypeOrmModule]
})

export class PrivilegeModule {}
