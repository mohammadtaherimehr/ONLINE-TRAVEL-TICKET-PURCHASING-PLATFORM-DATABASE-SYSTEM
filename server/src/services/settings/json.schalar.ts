import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import _ from 'lodash';

@Scalar('Json')
export class JsonScalar implements CustomScalar<string, any> {
  description = 'Json custom scalar type';

  parseValue(value: unknown): string {
    this.validateFormat(value);

    return value as string;
  }

  serialize(value: any): any {
    return JSON.parse(value);
  }
  // parseLiteral is a WIP, take it with a grain of salt
  parseLiteral(ast: ValueNode): string {
    if (ast.kind !== Kind.STRING) {
      throw new Error(`The input value is not a string`);
    }

    this.validateFormat(ast.value);

    return ast.value;
  }

  private validateFormat(input: any): void {
    if (_.isNil(input) || input.constructor !== Object)
      throw new Error(`The input string is not in JSON format`);
  }
}
