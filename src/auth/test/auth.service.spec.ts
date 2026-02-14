import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('someSalt'),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
type MockJwtSerive = Partial<Record<keyof JwtService, jest.Mock>>;

const mockJwtService = {
  signAsync: jest.fn(),
};
const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: MockJwtSerive;
  let userRepository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should throw ConflictException if email is in use', async () => {
      const signUpDto = {
        email: 'example@example.com',
        password: 'Password123!@#',
      };
      userRepository.save?.mockRejectedValue({
        code: '23505',
        detail: 'Key (email)=(example@example.com) already exists',
      });

      const signUpAction = service.signUp(signUpDto);

      await expect(signUpAction).rejects.toThrow(ConflictException);
    });

    it('should throw an error if an unexpexted error occurs', async () => {
      const signUpDto = {
        email: 'example@example.com',
        password: 'Password123!@#',
      };
      userRepository.save?.mockRejectedValue(new Error('Unexpected error'));

      const signUpAction = service.signUp(signUpDto);

      await expect(signUpAction).rejects.toThrow(Error);
    });

    it('should creates a new user with email a hashed password if the email is not in use', async () => {
      const signUpDto = {
        email: 'example@example.com',
        password: 'Password123!@#',
      };
      userRepository.create.mockImplementation((userData) => ({ ...userData }));
      userRepository.save?.mockResolvedValue({});

      const signUpAction = service.signUp(signUpDto);

      await expect(signUpAction).resolves.not.toThrow(Error);
      expect(userRepository.create).toHaveBeenCalledWith({
        email: 'example@example.com',
        password: 'hashedPassword',
      });
      expect(userRepository.save).toHaveBeenCalledWith({
        email: 'example@example.com',
        password: 'hashedPassword',
      });
    });
  });
});
