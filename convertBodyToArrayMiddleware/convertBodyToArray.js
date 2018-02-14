export default function convertBodyToArray(req, res, next) {
    if (!Array.isArray(req.body)) {
        req.body = [req.body]
    }

    next();
}