import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/ (GET)", () => {
    return request(app.getHttpServer())
      .get("/")
      .expect(200)
      .expect("Hello Prisma!");
  });

  it("/posts (POST) - success", async () => {
    const res = await request(app.getHttpServer()).post("/posts").send({ title: "Title #" });
    expect(res.body.title).toBe("Title #");
    expect(res.body.id).toBeGreaterThan(0);
    expect(res.statusCode).toBe(201);
  });

});
