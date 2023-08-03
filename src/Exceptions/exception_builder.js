import HttpStatus from "http-status-codes";

class ExceptionResponseBuilder {
    throw_response  = (error) =>{
        return {
            "name": error.extensions.exception["name"] || "Exception",
            "message": error.message || "An exception has occurred.",
            "status": error.extensions.exception["statusCode"] || HttpStatus.BAD_REQUEST,
            "data": error.extensions.exception["data"] || {},
            "meta": error.extensions.exception["meta"] || {},
        };
    }
}

export default ExceptionResponseBuilder;