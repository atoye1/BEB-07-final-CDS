import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ExecutionContext } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PriceFeedService } from '../src/batch/priceFeed.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { Web3AuthGuard } from '../src/auth/web3-auth.guard';

const legacyEndpoint = 'https://dubnjq842z47s.cloudfront.net';

describe('AppController (e2e)', () => {
  describe('Users API without Auth', () => {
    let app: INestApplication;
    let httpService: HttpService;
    const validAddress = '0x746d6375e82ba702785df6d5ec880da2480c16d7';
    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideProvider(PriceFeedService)
        .useValue({})
        .compile();
      app = moduleFixture.createNestApplication();
      httpService = moduleFixture.get<HttpService>(HttpService);
      app.use(cookieParser());
      app.useGlobalPipes(new ValidationPipe({ transform: true }));
      await app.init();
    });

    it('should success when request /users (GET)', async () => {
      const result = await firstValueFrom(
        httpService.get(`${legacyEndpoint}/users`).pipe(map((x) => x?.data)),
      );
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect(result);
    });

    it('should fail when provides wrong address to /users (GET)', async () => {
      const wrongAddress = 'I am not an Ethereum Address';
      return request(app.getHttpServer())
        .get(`/users/${wrongAddress}`)
        .expect(400);
    });

    it('should success when provides with valid address to /users (GET)', async () => {
      const result = await firstValueFrom(
        httpService
          .get(`${legacyEndpoint}/users/${validAddress}`)
          .pipe(map((x) => x?.data)),
      );
      return request(app.getHttpServer())
        .get(`/users/${validAddress}`)
        .expect(200)
        .expect(result);
    });

    it('should success when provides with valid address to /users/{address}/swaps (GET)', async () => {
      const result = await firstValueFrom(
        httpService
          .get(`${legacyEndpoint}/users/${validAddress}/swaps`)
          .pipe(map((x) => x?.data)),
      );
      return request(app.getHttpServer())
        .get(`/users/${validAddress}/swaps`)
        .expect(200)
        .expect(result);
    });

    it('should success when provides with valid address to /users/{address}/transactions (GET)', async () => {
      const result = await firstValueFrom(
        httpService
          .get(`${legacyEndpoint}/users/${validAddress}/transactions`)
          .pipe(map((x) => x?.data)),
      );
      return request(app.getHttpServer())
        .get(`/users/${validAddress}/transactions`)
        .expect(200)
        .expect(result);
    });
    it('should get 401 when request "/users/my" without proper auth', async () => {
      return request(app.getHttpServer()).get('/users/my').expect(401);
    });

    it('should get 401 when request "/users/my/transactions" without proper auth', async () => {
      return request(app.getHttpServer())
        .get('/users/my/transactions')
        .expect(401);
    });
    it('should get 401 when request "/users/my/swaps" without proper auth', async () => {
      return request(app.getHttpServer()).get('/users/my/swaps').expect(401);
    });
  });

  describe('Users API with Auth', () => {
    let app: INestApplication;
    let httpService: HttpService;
    const verifiedAddress = '0x746d6375e82ba702785df6d5ec880da2480c16d7';
    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideProvider(PriceFeedService)
        .useValue({})
        .overrideGuard(Web3AuthGuard)
        .useValue({
          canActivate: (context: ExecutionContext) => {
            const request = context.switchToHttp().getRequest();
            request['user'] = { verifiedAddress };
            return true;
          },
        })
        .compile();
      app = moduleFixture.createNestApplication();
      httpService = moduleFixture.get<HttpService>(HttpService);
      app.use(cookieParser());
      app.useGlobalPipes(new ValidationPipe({ transform: true }));
      await app.init();
    });
    it('should get 200 when request "/users/my" with proper auth', async () => {
      const result = await firstValueFrom(
        httpService
          .get(`${legacyEndpoint}/users/${verifiedAddress}`)
          .pipe(map((x) => x?.data)),
      );
      return request(app.getHttpServer())
        .get('/users/my')
        .expect(200)
        .expect(result);
    });

    it('should get 200 when request "/users/my/transactions" with proper auth', async () => {
      const result = await firstValueFrom(
        httpService
          .get(`${legacyEndpoint}/users/${verifiedAddress}/transactions`)
          .pipe(map((x) => x?.data)),
      );
      return request(app.getHttpServer())
        .get('/users/my/transactions')
        .expect(200)
        .expect(result);
    });
    it('should get 200 when request "/users/my/swaps" with proper auth', async () => {
      const result = await firstValueFrom(
        httpService
          .get(`${legacyEndpoint}/users/${verifiedAddress}/swaps`)
          .pipe(map((x) => x?.data)),
      );
      return request(app.getHttpServer())
        .get('/users/my/swaps')
        .expect(200)
        .expect(result);
    });
  });
});
