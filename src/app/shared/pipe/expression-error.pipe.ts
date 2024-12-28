import {Pipe, PipeTransform} from '@angular/core';
import {ExpressionService} from '../services/expression.service';

@Pipe({
  name: 'expressionError',
  standalone: false,
})
export class ExpressionErrorPipe implements PipeTransform {
  constructor(private expressionService: ExpressionService) {
  }

  transform(expression: string, context: Record<string, unknown>) {
    try {
      this.expressionService.evalSync(expression, context);
      return null;
    } catch (e: any) {
      return e.message;
    }
  }
}
