import passport from 'passport';
import { Strategy } from 'passport-local';
import * as crypto from 'crypto';
import User from '../../models/User';

passport.use(
  new Strategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, cb) => {
      try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
          return cb(null, false);
        }

        const hash = crypto
          .createHash('sha256')
          .update(password)
          .digest('base64');

        return cb(null, user.hash !== hash ? false : user);
      } catch (err) {
        return cb(err);
      }
    },
  ),
);

passport.serializeUser((user: User, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id: string, cb) => {
  try {
    const user = await User.findOne({ where: { id } });
    cb(null, user);
  } catch (err) {
    return cb(err);
  }
});

export default passport;
