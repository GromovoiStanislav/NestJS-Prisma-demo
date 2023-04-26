import { CreatePostDto } from "./create-post.dto";

export class CreateUserDto {
  name: string;
  email: string;
  posts?: CreatePostDto[];
  profile?: { bio: string };
}