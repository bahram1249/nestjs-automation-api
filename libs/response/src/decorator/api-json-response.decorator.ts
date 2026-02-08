import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { JsonResponseDto } from '../dto/json-response.dto';

export function ApiJsonResponse(options: {
  type: any;
  isArray?: boolean;
  status?: number;
  description?: string;
  extraModels?: any[];
}) {
  const {
    type,
    isArray = false,
    status = 200,
    description,
    extraModels = [],
  } = options;

  const responseOptions: any = {
    description: description || (status === 201 ? 'Created' : 'OK'),
    schema: {
      allOf: [
        { $ref: getSchemaPath(JsonResponseDto) },
        {
          properties: {
            result: isArray
              ? { type: 'array', items: { $ref: getSchemaPath(type) } }
              : { $ref: getSchemaPath(type) },
          },
        },
      ],
    },
  };

  return applyDecorators(
    ApiExtraModels(JsonResponseDto, type, ...extraModels),
    status === 201
      ? ApiCreatedResponse(responseOptions)
      : ApiOkResponse(responseOptions),
  );
}
