import {User} from "../../db/models/user.js";

export class UserControllerApi {
    async loginUser(req, res) {
        try {
            const user = await User.findOne({
                email: req.body.email
            });
            if (!user) {
                throw new Error('User does not exist');
            }
            const isValidPassword = user.comparePassword(req.body.password)
            if (!isValidPassword) {
                throw new Error('password not valid');
            }

            res.status(200).json({ token: user.apiToken });
        } catch (e) {
            console.log(e)
            res.status(401)
        }
    }
}