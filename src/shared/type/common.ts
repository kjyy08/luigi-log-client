export interface ErrorDetail {
    code: string;
    message: string;
}

export interface CommonResponse<T> {
    success: boolean;
    data: T;
    error?: ErrorDetail;
    timestamp: string;
}
