import { Injectable } from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { DatabaseService } from "./database/database.service";
import { PrismaClient, User as UserModel, Post as PostModel, Comment as CommentModel } from "@prisma/client";
import { UpdatePostDto } from "./dto/update-post.dto";
import { CommentDto } from "./dto/comment.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { CreateUserPostDto } from "./dto/create-user-post.dto";
import { Prisma } from "@prisma/client/scripts/default-index";

@Injectable()
export class AppService {

  constructor(
    private readonly dbService: DatabaseService
  ) {
  }

  async createPostByUserId(userId: number, dto: CreatePostDto): Promise<PostModel> {
    return this.dbService.post.create({
      data: {
        ...dto,
        author: {
          connect: { id: userId }
        }
      }
    });
  }

  async createPost(postData: CreateUserPostDto): Promise<PostModel> {
    const { title, content, authorEmail } = postData;

    return this.dbService.post.create({
      data: {
        title,
        content,
        author: {
          connect: { email: authorEmail }
        }
      }
    });
  }


  async updatePost(id: number, dto: UpdatePostDto): Promise<PostModel> {
    return this.dbService.post.update({
      where: { id },
      data: dto
    });
  }

  async getAllPosts(take: number, skip: number, searchString: string, orderBy: "asc" | "desc"): Promise<PostModel[]> {
    //return this.dbService.post.findMany()

    const or = searchString
      ? {
        OR: [
          { title: { contains: searchString } },
          { content: { contains: searchString } }
        ]
      }
      : {};

    return this.dbService.post.findMany({
      where: {
        ...or
      },
      include: {
        comments: true,
        author: {
          select: {
            id: true,
            name: true
          }
        }
      },
      take: Number(take) || undefined,
      skip: Number(skip) || undefined,
      orderBy: {
        //updatedAt: orderBy,
        id: orderBy
      }
    });

  }


  async getAllComments(): Promise<CommentModel[]> {
    return this.dbService.comment.findMany();
  }

  async getOnePost(id: number): Promise<PostModel> {

    // const client = new PrismaClient();
    // await client.$connect();
    // const res = await client.post.findUnique({ where: { id } });
    // await client.$disconnect();
    // return res;

    return this.dbService.post.findUnique({
      where: { id },
      include: {
        comments: true,
        author: true
      }
    });

  }

  async togglePublishPost(id: number): Promise<PostModel> {
    const postData = await this.dbService.post.findUnique({
      where: { id },
      select: {
        published: true
      }
    });

    return this.dbService.post.update({
      where: { id },
      data: { published: !postData?.published }
    });
  }


  addComment(postId: number, dto: CommentDto): Promise<CommentModel> {

    // return this.dbService.comment.create({
    //   data: { ...dto, postId }
    // })

    const { content } = dto;
    return this.dbService.comment.create({
      data: {
        content,
        post: {
          connect: { id: postId }
        }
      }
    });
  }

  async getAllDraftPosts(): Promise<PostModel[]> {
    return this.dbService.post.findMany({
      where: {
        published: false
      },
      include: {
        comments: true,
        author: true
      }
    });
  }

  async getAllPublishedPosts(take: number, skip: number, searchString: string, orderBy: "asc" | "desc"): Promise<PostModel[]> {

    const or = searchString
      ? {
        OR: [
          { title: { contains: searchString } },
          { content: { contains: searchString } }
        ]
      }
      : {};

    return this.dbService.post.findMany({
      where: {
        published: true,
        ...or
      },
      include: {
        comments: true,
        author: true
      },
      take: Number(take) || undefined,
      skip: Number(skip) || undefined,
      orderBy: {
        updatedAt: orderBy
      }
    });

  }


  async deletePost(postId: number): Promise<PostModel> {
    return this.dbService.post.delete({
      where: { id: postId }
    });
  }


  async incrementPostViewCount(postId: number): Promise<PostModel> {

    return this.dbService.post.update({
      where: { id: postId },
      data: {
        viewCount: {
          increment: 1
        }
      }
    });

  }


  async signupUser(userData: CreateUserDto): Promise<UserModel> {
    return this.dbService.user.create({
      data: userData
    });
  }

  async getAllUsers(): Promise<UserModel[]> {
    return this.dbService.user.findMany();
  }


  async getDraftsByUser(userId: number): Promise<PostModel[]> {
    return this.dbService.user
      .findUnique({
        where: { id: userId }
      })
      .posts({
        where: {
          published: false
        }
      });
  }

  async getPublishedByUser(userId: number): Promise<PostModel[]> {
    return this.dbService.user
      .findUnique({
        where: { id: userId }
      })
      .posts({
        where: {
          published: true
        },
        include: {
          comments: true
        }
      });
  }

  async getAllPostsRAW() {
    return this.dbService.$queryRaw`SELECT * FROM Post`;
  }

  async getOnePostRAW(postId: number) {
    return this.dbService.$queryRaw`SELECT * FROM Post WHERE id = ${postId}`;
  }

}
