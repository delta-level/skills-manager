import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';
import { User } from '../../src/users/entities/user.entity';

describe('UsersController (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);

    // Safety check - only run tests on test database
    const dbName = dataSource.options.database as string;
    if (dbName !== 'skills-manager-test') {
      throw new Error(
        `Tests must run on test database! Current database: ${dbName}`,
      );
    }
  });

  beforeEach(async () => {
    // Clean up test data before each test
    await dataSource.query('TRUNCATE TABLE users CASCADE');
  });

  afterAll(async () => {
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
          const user = res.body as User;
          expect(user).toHaveProperty('id');
          expect(user.name).toBe(createUserData.name);
          expect(user.email).toBe(createUserData.email);
          expect(user).toHaveProperty('createdAt');
          expect(user).toHaveProperty('updatedAt');
        });
    });

    it('should fail when body is empty', () => {
      return request(app.getHttpServer()).post('/users').send({}).expect(400);
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
