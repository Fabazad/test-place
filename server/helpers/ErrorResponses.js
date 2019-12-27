class ErrorResponses {
    static mongoose (err) {
        let messageError = '';
        if ('errors' in err) {
            Object.keys(err.errors).forEach(errorKey => {
                messageError += err.errors[errorKey].message + '\n';
            });
            return { status: 400, message: messageError }
        }
        return { status: 500, message: err.message };
    }
}

module.exports = ErrorResponses;