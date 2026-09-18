import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TransformerPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): string {
    return value.toLowerCase() + ' | PIPE';
  }
}
