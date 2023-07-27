class Utils {
    format_error_message = (error_message) => {
        return error_message.replace(/Path/g, "Value").replace(/`/g, '');
    }
}
export default Utils