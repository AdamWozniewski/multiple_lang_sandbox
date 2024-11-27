import {User} from "../../db/mongo/models/user.js";

export class UserController {
    register(req, res) {
        res.render('pages/auth/register', {});
    }
    async registerUser(req, res) {
        const user = new User(req.body);
        try {
            await user.save();
            res.redirect('/');
        } catch (e) {
            res.render('pages/auth/register', {errors: e.errors, form: req.body});
        }
    }
    showLogin(req, res) {
        res.render('pages/auth/login', {});
    }
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
            req.session.user = {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            }
            res.redirect('/');
        } catch (e) {
            console.log(e)
            res.render('pages/auth/login', {errors: e.errors, form: req.body});
        }
    }

    async logout(req, res) {
        await req.session.destroy();
        res.clearCookie('connect.sid');
        res.redirect('/login');
    }

    showProfile(req, res) {
        res.render('pages/auth/profile', {form: req.session.user});
    }

    async saveProfile(req, res) {
        const user = await User.findById(req.session.user._id);
        user.email = req.body.email;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        if (req.body.password) {
            user.password = req.body.password;
        }
        try {
            await user.save();
            req.session.user = user;
            res.redirect('/admin/profile'); // to oznacza: wróc skąd przyszedłeś
        } catch (e) {
            res.render('pages/auth/profile', {errors: e.errors, form: req.body});
        }
    }
}