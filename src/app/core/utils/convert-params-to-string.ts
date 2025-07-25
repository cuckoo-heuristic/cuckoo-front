import { QueryParams } from '@core/models/query-params.model';

export const convertParamsToString = <T extends QueryParams>(
  params: T,
  separateArrayItems = true
): string => {
  const keyValuePairs: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value) && separateArrayItems) {
      for (const item of value) {
        keyValuePairs.push(`${key}=${item}`);
      }
    } else {
      keyValuePairs.push(`${key}=${value}`);
    }
  }

  return keyValuePairs.join('&');
};
