//Globalny middleware
export const userMiddleware = (req,res,next)=> {
    res.locals.user = req.session.user;
    next();
};