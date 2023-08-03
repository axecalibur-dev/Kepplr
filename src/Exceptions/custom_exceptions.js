class GeneralException extends Error {
    constructor(name , message, statusCode, data , meta) {
        super(message);

        this.name = name;
        this.statusCode = statusCode;
        this.data = data;
        this.meta = meta;
    }
}
export default GeneralException;