// @ts-ignore

import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { trace } from 'joi';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    const dataSource = app.get(DataSource);
    await dataSource.dropDatabase();
    app.close();
  });

  describe('/auth/signup (POST)', () => {
    it('should successfully register a new user with valid email and password', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'example@gmail.com',
          password: 'Password123!@#',
          name: 'John',
          surname: 'Doe',
          role: 'viewer',
        })
        .expect(HttpStatus.CREATED);
    });

    it('should reject registration for an email that is already in use', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'example@gmail.com',
          password: 'Password123!@#',
          name: 'John',
          surname: 'Doe',
          role: 'viewer',
        })
        .expect(HttpStatus.CONFLICT)
        .expect((res) => {
          expect(res.body.message).toEqual('Email already in use');
        });
    });

    it('should fail to register with invalid email format', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'johndoegmail.com',
          password: 'Password123!@#',
          name: 'John',
          surname: 'Doe',
          role: 'viewer',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should fail to register with a password that is too short', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'example@gmail.com',
          password: 'Pr13!#',
          name: 'John',
          surname: 'Doe',
          role: 'viewer',
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message[0]).toEqual(
            'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol.',
          );
        });
    });
  });

  describe('/auth/signin (POST)', () => {
    it('should successfully login user with valid credentials and return an access token', () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: 'example@gmail.com',
          password: 'Password123!@#',
        })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.accessToken).toEqual(expect.any(String))
        });
    });

    it('should deny access for invalid login credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: 'example@gmail.com',
          password: 'Password123!@#1234567890',
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
