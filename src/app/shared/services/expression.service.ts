import {Injectable} from '@angular/core';
import {Jexl} from 'jexl';
import Expression from 'jexl/Expression';
import {RequirementFunction} from '../model/schema.interface';

@Injectable({
  providedIn: 'root',
})
export class ExpressionService {
  private jexl = new Jexl();
  private compiledExpressions = new Map<string, Expression>;

  evalSync(expression: string, context?: Record<string, unknown>): unknown {
    return this.compile(expression).evalSync(context);
  }

  async eval(expression: string | RequirementFunction, context?: Record<string, unknown>): Promise<unknown> {
    if (typeof expression === 'string') {
      return this.compile(expression).eval(context);
    } else {
      return expression(context ?? {});
    }
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
