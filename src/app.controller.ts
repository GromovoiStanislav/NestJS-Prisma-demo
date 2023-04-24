import { Body, Controller, Get, Inject, Param, ParseIntPipe, Delete, Post, Put, Query } from "@nestjs/common";
import { AppService } from "./app.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { CommentDto } from "./dto/comment.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { CreateUserPostDto } from "./dto/create-user-post.dto";

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


  @Put("posts/:id")
  async updatePost(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdatePostDto) {
    return this.appService.updatePost(id, dto);
  }

  @Post("posts/:id/comment")
  async addComment(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: CommentDto) {
    return this.appService.addComment(id, dto);
  }

  @Put("posts/:id/publish")
  async togglePublishPost(@Param("id", ParseIntPipe) id: number) {
    return this.appService.togglePublishPost(id);
  }


  @Get("posts")
  async getAllPosts(
    @Query("take") take?: number,
    @Query("skip") skip?: number,
    @Query("searchString") searchString?: string,
    @Query("orderBy") orderBy?: "asc" | "desc"
  ) {
    return this.appService.getAllPosts(take, skip, searchString, orderBy);
  }

  @Get("posts/drafts")
  async getAllDraftPosts() {
    return this.appService.getAllDraftPosts();
  }

  @Get("posts/published")
  async getAllPublishedPosts(
    @Query("take") take?: number,
    @Query("skip") skip?: number,
    @Query("searchString") searchString?: string,
    @Query("orderBy") orderBy?: "asc" | "desc"
  ) {
    return this.appService.getAllPublishedPosts(take, skip, searchString, orderBy);
  }


  @Get("posts/:id")
  async getOnePost(@Param("id", ParseIntPipe) id: number) {
    return this.appService.getOnePost(id);
  }

  @Delete("posts/:id")
  async deletePost(@Param("id", ParseIntPipe) id: number) {
    return this.appService.deletePost(id);
  }

  @Get("comments")
  async getAllComments() {
    return this.appService.getAllComments();
  }


  @Put("/posts/:id/views")
  async incrementPostViewCount(@Param("id", ParseIntPipe) id: number) {
    return this.appService.incrementPostViewCount(id);
  }


  @Post("signup")
  async signupUser(@Body() userData: CreateUserDto) {
    return this.appService.signupUser(userData);
  }


  @Get("users")
  async getAllUsers() {
    return this.appService.getAllUsers();
  }

  @Get("users/:id/drafts")
  async getDraftsByUser(@Param("id", ParseIntPipe) id: number) {
    return this.appService.getDraftsByUser(id);
  }

  @Get("users/:id/published")
  async getPublishedByUser(@Param("id", ParseIntPipe) id: number) {
    return this.appService.getPublishedByUser(id);
  }


  @Post("users/:id/posts")
  async createPostByUserId(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: CreatePostDto) {
    return this.appService.createPostByUserId(id, dto);
  }

  @Post("posts")
  async createPost(
    @Body() dto: CreateUserPostDto) {
    return this.appService.createPost(dto);
  }

  @Get("posts-raw")
  async getAllPostsRAW(){
    return this.appService.getAllPostsRAW()
  }

  @Get("posts-raw/:id")
  async getOnePostRAW(@Param("id", ParseIntPipe) id: number){
    return this.appService.getOnePostRAW(id)
  }

}
