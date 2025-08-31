import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model.js';
import dotenv from 'dotenv'

dotenv.config()

passport.use(new GoogleStrategy({
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
	try {
		let user = await User.findOne({ googleId: profile.id });
		if (!user) {
			user = new User({
				googleId: profile.id,
				username: profile.displayName,
				email: profile.emails[0].value,
				avatar: profile.photos[0].value,
				role: 'user',
			});
			await user.save();
		}
		return done(null, user);
	} catch (err) {
		return done(err, null);
	}
}));

export default passport;