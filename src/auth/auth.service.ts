import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import PostgreSQLErrorCode from '../postgresql-error-code';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    // Check user from the database
    const user = await this.userRepository.findOneBy({
      email: signInDto.email,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Match user password
    const isMatch = await bcrypt.compare(signInDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Make a JWT payload
    const payload = {
      id: user.id,
      email: signInDto.email,
      role: user.role,
    };

    // Get a access token from jwtService
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  async signUp(signupDto: SignUpDto) {
    const { name, surname, email, password, role } = signupDto;

    // Generate a salt using bcrypt
    const salt = await bcrypt.genSalt();

    // Hash the password along with the salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with the hashed password
    const user = this.userRepository.create({
      name,
      surname,
      email,
      password: hashedPassword,
      role,
    });

    try {
      // Attempt to save the new user to the database
      await this.userRepository.save(user);
    } catch (error) {
      // Handling unique constraint error (email dublication)
      if (error.code === PostgreSQLErrorCode.UniqueViolation) {
        throw new ConflictException('Email already in use');
      }
      // Throw other errors as they are
      throw error;
    }
  }
}
