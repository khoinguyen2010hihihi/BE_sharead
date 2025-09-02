// src/config/passport.config.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;

// serialize / deserialize: lưu id vào session, khi cần load lại từ DB
passport.serializeUser((user, done) => {
  // lưu id (sử dụng _id hoặc id tùy model)
  done(null, user._id ? String(user._id) : String(user.id));
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// chỉ khởi tạo GoogleStrategy khi có đủ config
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.warn(
    '[passport] Google OAuth not initialized: missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in env'
  );
} else {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL || '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // lấy giá trị an toàn từ profile
          const googleId = profile?.id;
          const displayName = profile?.displayName || '';
          const email = profile?.emails?.[0]?.value;
          const avatar = profile?.photos?.[0]?.value;

          if (!googleId) {
            return done(new Error('Google profile does not contain id'), null);
          }

          let user = await User.findOne({ googleId });

          if (!user) {
            // nếu muốn, có thể kiểm tra email tồn tại để tránh duplicate accounts
            user = new User({
              googleId,
              username: displayName || `google_${googleId}`,
              email: email || undefined,
              avatar: avatar || undefined,
              role: 'user',
            });
            await user.save();
          } else {
            // cập nhật avatar/email nếu thay đổi (tuỳ chọn)
            let needSave = false;
            if (email && user.email !== email) {
              user.email = email;
              needSave = true;
            }
            if (avatar && user.avatar !== avatar) {
              user.avatar = avatar;
              needSave = true;
            }
            if (needSave) await user.save();
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}

export default passport