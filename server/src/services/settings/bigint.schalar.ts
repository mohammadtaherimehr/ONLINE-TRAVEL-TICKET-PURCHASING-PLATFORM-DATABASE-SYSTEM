import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('BigInt', (type) => BigInt)
export class BigintScalar implements CustomScalar<number, BigInt> {
  description = 'bigint scalar type';

  parseValue(value: any): bigint {
    return BigInt(value);
  }

  serialize(value: any): number {
    return Number(value);
  }

  parseLiteral(ast: ValueNode): BigInt {
    if (ast.kind === Kind.INT) {
      return BigInt(ast.value);
    }

    throw new Error('object cannot be serialized to bigint');
  }
}
