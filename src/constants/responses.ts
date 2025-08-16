export enum StatusCodes {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

export enum ErrorMessages {
    SERVER_ERROR = "Something went wrong. Please try again later.",
    ROUTE_NOT_FOUND = "Route not found",
    RESOURCE_NOT_FOUND = "Resource not found",
}