export interface BaseResponse {
  status: number;
  success: boolean;
  messages: any;
}

export interface ApiResponse<Entity> extends BaseResponse {
  result: Entity;
}

export interface ApiResponsePaginated<Entity> extends BaseResponse {
  result: {
    count: number;
    next: string;
    previous: string;
    results: Entity[];
  };
}
