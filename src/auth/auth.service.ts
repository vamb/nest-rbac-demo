import { Injectable, BadRequestException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    // const user = await this.userService.findUserByName(username, pass)
    // const { password, ...result } = user
    // return result
    return await this.userService.findUserByName(username, pass)
  }

  async login(user: any) {
   const restUser = await this.userService.findUserByName(user.username, user.password)
    if(restUser){
      const payload = { username: user.username, sub: restUser.id };
      return {
        access_token: this.jwtService.sign(payload)
      }
    }else{
      throw new BadRequestException('Wrong username or password')
    }
  }
}
