import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './create-user.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly db: PrismaService) {}

  async create(dto: CreateUserDto) {
    const user = await this.db.user.create({ data: { name: dto.name, email: dto.email } });
    return { id: user.id };
  }
}
