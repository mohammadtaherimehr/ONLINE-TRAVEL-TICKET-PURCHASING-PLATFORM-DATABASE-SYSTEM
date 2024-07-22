import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('Timestamp', (type) => Date)
export class TimestampSchalar implements CustomScalar<number, Date> {
  description = 'timestamp schalar';

  parseValue(value: any): Date {
    console.log(value);
    return new Date(value);
  }

  serialize(value: any): number {
    return value.getTime();
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.INT) {
      return new Date(Number(ast.value));
    }

    throw new Error('object cannot be serialized to datetime');
  }
}
