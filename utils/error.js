exports.errorMessage = (message) => {
    if (typeof message === 'string') {
        let error = new Error(message);
        error.status = 1;
        return (error);
    }
    return (null);
};
