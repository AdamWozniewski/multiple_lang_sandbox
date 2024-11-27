import {User} from "../db/mongo/models/user.js";

export const isAuthMiddleware = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        res.sendStatus(403).send({
            message: 'brak dostępu'
        })
    }
    const user = await User.findOne({ apiToken: token })
    if (!user) {
         res.sendStatus(403).send({
            message: 'brak dostępu'
        })
    }

    req.user = user;
    next();
};