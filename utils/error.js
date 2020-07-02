exports.errorMessage = (message) => {
    if (typeof message === 'string') {
        let error = new Error(message);
        error.status = 1;
        return (error);
    }
    return (null);
};

exports.errorObject = (message, status_code) => {
    if (typeof message === 'string' && typeof status_code === 'number') {
        return ({ 'error': message, 'status': status_code });
    }
    return (null);
};
