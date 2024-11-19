//Globalny middleware
export const isAuthMiddleware = (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/');
    }
    next();
};