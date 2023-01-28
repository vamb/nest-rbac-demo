import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolePrivilegeService } from './role.privilege.service';
import { CreateRolePrivilegeDto } from './dto/create-role.privilege.dto';
import { UpdateRolePrivilegeDto } from './dto/update-role.privilege.dto';

@Controller('role.privilege')
export class RolePrivilegeController {
  constructor(private readonly rolePrivilegeService: RolePrivilegeService) {}

  @Post()
  create(@Body() createRolePrivilegeDto: CreateRolePrivilegeDto) {
    return this.rolePrivilegeService.create(createRolePrivilegeDto);
  }

  @Get()
  findAll() {
    return this.rolePrivilegeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolePrivilegeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRolePrivilegeDto: UpdateRolePrivilegeDto) {
    return this.rolePrivilegeService.update(+id, updateRolePrivilegeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolePrivilegeService.remove(+id);
  }
}
