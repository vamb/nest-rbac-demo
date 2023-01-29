import {
  Body, Controller, Delete, Get, HttpStatus, Param,
  Patch, Post, Put, Query, Req, Request, UseGuards
} from '@nestjs/common';
import {RoleService} from './role.service';
import {CreateRoleDto} from './dto/create-role.dto';
import {UpdateRoleDto} from './dto/update-role.dto';

import {PaginationDto} from "../common/dto/pagination.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('role')
@UseGuards(JwtAuthGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('save')
  async saveRole(@Body() createRoleDto: CreateRoleDto, @Request() request){
    const rest: any = await this.roleService.saveRole(createRoleDto, request)
    return {
      data: '',
      status: rest? HttpStatus.OK: HttpStatus.BAD_REQUEST
    }
  }

  @Get('all')
  async findAll(@Query() paginationDto: PaginationDto) {
    paginationDto.page = Number(paginationDto.page)
    paginationDto.size = Number(paginationDto.size)
    const rest = await this.roleService.findAll({
      ...paginationDto,
      size: paginationDto.size < 10? 10: paginationDto.size
    });
    return {
      data: rest,
      status: HttpStatus.OK
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const rest = await this.roleService.findOne(+id);
    return {
      data: rest,
      status: HttpStatus.OK
    }
  }

  // 增量更新
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @Req() req) {
    const rest = await this.roleService.patchUpdate(+id, updateRoleDto, req.user.email);
    return {
      data: '',
      status: rest? HttpStatus.OK: HttpStatus.BAD_REQUEST
    }
  }

  // 全量更新
  @Put(':id')
  async putUpdate(@Param('id')id: string, @Body() updateRoleDto: UpdateRoleDto, @Request() req){
    const rest = await this.roleService.putUpdate(+id, updateRoleDto, req.user.email)
    return {
      data: '',
      status: rest? HttpStatus.OK: HttpStatus.BAD_REQUEST
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.roleService.remove(+id);
    return {
      data: null,
      status: HttpStatus.OK
    }
  }
}
