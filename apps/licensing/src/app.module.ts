import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { DomainErrorFilter } from './common/domain-error.filter.js';
import { CompaniesModule } from './companies/companies.module.js';
import { InvitationsModule } from './invitations/invitations.module.js';
import { LicencesModule } from './licences/licences.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [UsersModule, CompaniesModule, LicencesModule, InvitationsModule],
  providers: [
    { provide: APP_PIPE, useValue: new ValidationPipe({ transform: true, whitelist: true }) },
    { provide: APP_FILTER, useClass: DomainErrorFilter },
  ],
})
export class AppModule {}
