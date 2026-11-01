import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateLicenceDto } from './create-licence.dto.js';
import { LicencesService } from './licences.service.js';

@Controller('companies/:id/licences')
export class LicencesController {
  constructor(private readonly licences: LicencesService) {}

  @Post()
  create(@Param('id') id: string, @Body() dto: CreateLicenceDto) {
    return this.licences.create(id, dto);
  }

  @Get()
  list(@Param('id') id: string) {
    return this.licences.list(id);
  }
}
