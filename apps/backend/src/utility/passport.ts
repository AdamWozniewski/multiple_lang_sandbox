import passport from 'passport';
import { UserService } from '@services/User-Service.js';

const userService = new UserService();

passport.serializeUser(({ id }, done) => {
  done(null, id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await userService.findUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
