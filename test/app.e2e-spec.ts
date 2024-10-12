import { PrismaService } from './../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/login', () => {
    it('should return access token and success message', async () => {
      const validUser = {
        email: 'bhar@example.commmmm1',
        password: '123',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(validUser)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body.data).toHaveProperty('token');
    });

    it('should return Invalid email or password', async () => {
      const invalidUser = {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(invalidUser)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Login failed');
      expect(response.body).toHaveProperty('error');
    });
  });
});
