import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ActingUser } from '../common/acting-user.decorator.js';
import { AcceptInvitationDto, InviteDto } from './invitation.dto.js';
import { InvitationsService } from './invitations.service.js';

@Controller()
export class InvitationsController {
  constructor(private readonly invitations: InvitationsService) {}

  @Post('companies/:id/invitations')
  invite(@Param('id') id: string, @Body() dto: InviteDto) {
    return this.invitations.invite(id, dto);
  }

  @Get('companies/:id/invitations')
  pending(@Param('id') id: string) {
    return this.invitations.pending(id);
  }

  @Post('invitations/accept')
  accept(@ActingUser() actingUserId: string, @Body() dto: AcceptInvitationDto) {
    return this.invitations.accept(actingUserId, dto.token);
  }
}
