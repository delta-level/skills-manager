import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/users (POST)', () => {
    it('should create a user with valid data', () => {
      const createUserData = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(createUserData.name);
          expect(res.body.email).toBe(createUserData.email);
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
        });
    });

    it('should fail when body is empty', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({})
        .expect(400);
    });

    it('should fail when name is missing', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({ email: 'john@example.com' })
        .expect(400);
    });

    it('should fail when email is missing', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({ name: 'John Doe' })
        .expect(400);
    });

    it('should fail when email is invalid', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({ name: 'John Doe', email: 'not-an-email' })
        .expect(400);
    });

    it('should fail when name is not a string', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({ name: 123, email: 'john@example.com' })
        .expect(400);
    });
  });
});
