import passport from 'passport';
// import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import { UserService } from '@services/User-Service.js';
// import { config } from '@config';

const userService = new UserService();

// passport.use(
//   new OAuth2Strategy(
//     {
//       authorizationURL: 'https://provider.com/oauth2/authorize',
//       tokenURL: 'https://provider.com/oauth2/token',
//       clientID: config.oauthClientId,
//       clientSecret: config.oauthClientSecret,
//       callbackURL: 'http://localhost:3000/auth/callback',
//     },
//     async (
//       _accessToken: string,
//       _refreshToken: string,
//       profile: any,
//       done: any,
//     ) => {
//       try {
//         const user = await userService.findUserByEmail(profile.email);
//
//         if (!user) {
//           const newUser = await userService.createUser({
//             email: profile.email,
//             password: profile.password,
//           });
//           return done(null, newUser);
//         }
//
//         return done(null, user);
//       } catch (error) {
//         return done(error);
//       }
//     },
//   ),
// );

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
