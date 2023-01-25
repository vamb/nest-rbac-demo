import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { jwtConstants } from "./constants";
import { UserService } from "../user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  // 验证jwt的时候会调用这里，如果能查到就会返回用户的信息，如果查不到就抛错误出去
  async validate(payload: any) {
    const restUser = await this.userService.findOne(payload.sub)
    if(restUser && restUser.name === payload.username){
      return restUser
    }else{
      throw new UnauthorizedException()
    }
    // return { userId: payload.sub, username: payload.username };
  }
}
