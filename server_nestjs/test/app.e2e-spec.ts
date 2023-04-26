import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PriceFeedService } from '../src/batch/priceFeed.service';
import axios from 'axios';

const legacyEndpoint = 'https://dubnjq842z47s.cloudfront.net';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let priceFeedService: PriceFeedService;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PriceFeedService)
      .useValue({})
      .compile();
    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterAll(() => {});

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
  it('/users (GET)', async () => {
    const legacy = await axios.get(`${legacyEndpoint}/users`);
    console.log({ legacy });
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect(legacy);
  });
});
