const logRequestDetails = (req, res, next) => {
    console.log('Request Path:', req.path);
    console.log('Request URL:', req.url);
    console.log('Request Method:', req.method);
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    console.log('Request Query:', req.query);
    next(); // Pass control to the next middleware in the chain
};

module.exports = {
    logRequestDetails
}