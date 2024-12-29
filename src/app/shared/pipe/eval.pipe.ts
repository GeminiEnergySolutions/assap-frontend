import {Pipe, PipeTransform} from '@angular/core';
import {ExpressionService} from '../services/expression.service';

@Pipe({
  name: 'eval',
  pure: true,
})
export class EvalPipe implements PipeTransform {
  constructor(
    private expressionService: ExpressionService,
  ) {
  }

  transform(expression: string, context?: Record<string, unknown>): Promise<unknown> {
    return this.expressionService.eval(expression, context);
  }
}
