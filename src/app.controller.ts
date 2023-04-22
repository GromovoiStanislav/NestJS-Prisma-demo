import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { CreatePostDto } from "./dto/create-post.dto";

@Controller()
export class AppController {
  constructor(
    @Inject("TEST") private readonly testService: string,
    private readonly appService: AppService
  ) {
  }

  @Get()
  getHello(): string {
    return this.testService;
  }

  @Post("posts")
  async createPost(@Body() dto: CreatePostDto) {
    return this.appService.createPost(dto);
  }

  @Get("posts")
  async getAllPosts() {
    return this.appService.getAllPosts();
  }

}
