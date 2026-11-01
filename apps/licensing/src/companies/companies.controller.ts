import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ActingUser } from '../common/acting-user.decorator.js';
import { CompaniesService } from './companies.service.js';
import { ChangeRoleDto, CreateCompanyDto } from './company.dto.js';
import { MembersService } from './members.service.js';

@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly companies: CompaniesService,
    private readonly members: MembersService,
  ) {}

  @Post()
  create(@ActingUser() actingUserId: string, @Body() dto: CreateCompanyDto) {
    return this.companies.create(actingUserId, dto);
  }

  @Get(':id/members')
  listMembers(@Param('id') id: string) {
    return this.members.list(id);
  }

  @Delete(':id/members/:userId')
  removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.members.remove(id, userId);
  }

  @Patch(':id/members/:userId')
  changeRole(@Param('id') id: string, @Param('userId') userId: string, @Body() dto: ChangeRoleDto) {
    return this.members.changeRole(id, userId, dto.role);
  }
}
