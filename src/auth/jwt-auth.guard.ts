import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthorizationService } from 'src/authorization/authorization.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    private readonly authorizationService: AuthorizationService 
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    if (!result) {
      throw new UnauthorizedException('User not authenticated');
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const userIdMain = user.userId;
    const { userId, columnId, cardId, commentId } = request.params;

    if (userId != userIdMain ){
      throw new UnauthorizedException('You do not have permission to access this user');
    }

    if (columnId) {
      await this.authorizationService.checkColumnOwnership(userId, columnId);
    }

    if (cardId && columnId) {
      await this.authorizationService.checkCardOwnership(userId, columnId, cardId);
    }

    if (commentId && cardId && columnId) {
      await this.authorizationService.checkCommentOwnership(userId, columnId, cardId, commentId);
    }

    return true;
  }
}
