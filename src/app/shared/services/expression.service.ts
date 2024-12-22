import {Injectable} from '@angular/core';
import {Jexl} from 'jexl';
import Expression from 'jexl/Expression';

@Injectable({
  providedIn: 'root',
})
export class ExpressionService {
  private jexl = new Jexl();
  private compiledExpressions = new Map<string, Expression>;

  evalSync(expression: string, context?: Record<string, unknown>): unknown {
    return this.compile(expression).evalSync(context);
  }

  eval(expression: string, context?: Record<string, unknown>): Promise<unknown> {
    return this.compile(expression).eval(context);
  }

  private compile(expression: string): Expression {
    let compiledExpression = this.compiledExpressions.get(expression);
    if (!compiledExpression) {
      compiledExpression = this.jexl.compile(expression);
      this.compiledExpressions.set(expression, compiledExpression);
    }
    return compiledExpression;
  }
}
