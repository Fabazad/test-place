class ErrorResponses {
    static mongoose (err) {
        let messageError = '';
        Object.keys(err.errors).forEach(errorKey => {
            messageError += err.errors[errorKey].message + '\n';
        });
        return { status: 400, message: messageError }
    }
}

module.exports = ErrorResponses;