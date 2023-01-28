import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards
} from '@nestjs/common';
import {PrivilegeService} from './privilege.service';
import {CreatePrivilegeDto} from './dto/create-privilege.dto';
import {UpdatePrivilegeDto} from './dto/update-privilege.dto';

import {PaginationDto} from "../common/dto/pagination.dto";
import {PrivilegeValidationPipe} from "../common/pipe/privilege.validation.pipe";
import {JwtAuthGuard} from '../auth/jwt-auth.guard'

@Controller('privilege')
@UseGuards(JwtAuthGuard)
export class PrivilegeController {
  constructor(private readonly privilegeService: PrivilegeService) {}

  @Post('save')
  async savePrivilege(@Body(new PrivilegeValidationPipe()) privilege: CreatePrivilegeDto, @Request() req){
    const rest: any = await this.privilegeService.savePrivilege(privilege, req.user.email)
    return {
      data: '',
      status: rest? HttpStatus.OK: HttpStatus.BAD_REQUEST
    }
  }

  @Get('all')
  async findAll(@Query() paginationDto: PaginationDto) {
    paginationDto.page = Number(paginationDto.page)
    paginationDto.size = Number(paginationDto.size)
    const result = await this.privilegeService.findAll({
      ...paginationDto,
      size: paginationDto.size < 10 ? 10: paginationDto.size
    });
    return {
      data: result,
      status: HttpStatus.OK
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const rest = await this.privilegeService.findOne(+id);
    return {
      data: rest,
      status: HttpStatus.OK
    }
  }

  // 增量更新
  @Patch(':id')
  patchUpdate(
    @Param('id') id: string,
    @Body() updatePrivilegeDto: UpdatePrivilegeDto,
    @Request() req
  ) {
    const rest = this.privilegeService.putUpdate(+id, updatePrivilegeDto, req.user.email)
    return {
      data: '',
      status: rest? HttpStatus.OK: HttpStatus.BAD_REQUEST
    }
  }

  // 全量更新
  @Put(':id')
  putUpdate(
    @Param('id') id: string,
    @Body() updatePrivilegeDto: UpdatePrivilegeDto,
    @Request() req
  ) {
    const rest = this.privilegeService.putUpdate(+id, updatePrivilegeDto, req.user.email)
    return {
      data: '',
      status: rest? HttpStatus.OK: HttpStatus.BAD_REQUEST
    }
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
