import { Module } from '@nestjs/common';
import { PrivilegeService } from './privilege.service';
import { PrivilegeController } from './privilege.controller';

@Module({
  controllers: [PrivilegeController],
  providers: [PrivilegeService]
})
export class PrivilegeModule {}
