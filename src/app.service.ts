import { Injectable } from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { DatabaseService } from "./database/database.service";

@Injectable()
export class AppService {

  constructor(
    private readonly dbService: DatabaseService
  ) {
  }

  async createPost(dto: CreatePostDto) {
    return this.dbService.post.create({ data: dto });
  }

  async getAllPosts() {
    return this.dbService.post.findMany();
  }
}
