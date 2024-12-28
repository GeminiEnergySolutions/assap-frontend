import {Pipe, PipeTransform} from '@angular/core';
import {ExpressionService} from '../services/expression.service';

@Pipe({
  name: 'eval',
  pure: true,
  standalone: false,
})
export class EvalPipe implements PipeTransform {
  constructor(
    private expressionService: ExpressionService,
  ) {
  }

  transform(expression: string, context?: Record<string, any>): Promise<any> {
    return this.expressionService.eval(expression, context);
  }
}
