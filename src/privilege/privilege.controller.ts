import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpStatus } from '@nestjs/common';
import { PrivilegeService } from './privilege.service';
import { CreatePrivilegeDto } from './dto/create-privilege.dto';
import { UpdatePrivilegeDto } from './dto/update-privilege.dto';

import { PrivilegeValidationPipe } from "../common/pipe/privilege.validation.pipe";
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('privilege')
@UseGuards(JwtAuthGuard)
export class PrivilegeController {
  constructor(private readonly privilegeService: PrivilegeService) {}

  @Post()
  create(@Body() createPrivilegeDto: CreatePrivilegeDto) {
    return this.privilegeService.create(createPrivilegeDto);
  }

  @Post('save')
  async savePrivilege(@Body(new PrivilegeValidationPipe()) privilege: CreatePrivilegeDto, @Request() req){
    return this.privilegeService.savePrivilege(privilege, req.user.email)
  }

  @Get()
  findAll() {
    return this.privilegeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const rest = await this.privilegeService.findOne(+id);
    return {
      data: rest,
      status: HttpStatus.OK
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePrivilegeDto: UpdatePrivilegeDto) {
    return this.privilegeService.update(+id, updatePrivilegeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.privilegeService.remove(+id);
    return {
      data: null,
      status: HttpStatus.OK
    }
  }
}
