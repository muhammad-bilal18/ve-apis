export function exception(ex, req, res, next) {
    console.log(ex.message);
    res.status(500).send({
        message: 'Internal server error. Please try again later.'
    });
}