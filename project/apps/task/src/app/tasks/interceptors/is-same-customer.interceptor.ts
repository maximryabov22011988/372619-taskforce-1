import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TaskStatusId } from '@project/libs/shared-types';
import { TasksService } from '../tasks.service';

@Injectable()
export class isSameCustomerInterceptor implements NestInterceptor {
  constructor(private readonly tasksService: TasksService) {}

  public async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const userId = request.user.sub;
    const { taskId } = request.params;
    const { statusId } = request.body;

    const taskModel = await this.tasksService.findById(Number(taskId));

    if (statusId !== TaskStatusId.Failed && taskModel.customerId !== userId) {
      throw new ForbiddenException(
        "Changing other people's tasks is forbidden"
      );
    }

    return next.handle();
  }
}
