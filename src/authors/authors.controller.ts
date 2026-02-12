import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AccessControlGuard } from '../auth/guards/access-control.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { Role } from '../auth/entities/user.entity';

@Controller('authors')
@UseGuards(AuthGuard, AccessControlGuard)
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get()
  @Roles(Role.ADMIN, Role.VIEWER)
  findAll() {
    return this.authorsService.findAll();
  }

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.create(createAuthorDto);
  }
}
