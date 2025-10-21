const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { getUser, createUser } = require("../services/authService"); // service DB

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/user/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        let user = await getUser(email);

        let isNew = false;
        if (!user) {
          user = await createUser({
            fullName: profile.displayName,
            email,
            password: null,
            phone: null,
            address: null,
            age: null,
            gender: null,
          });
          isNew = true;
        }

        // chỉ trả về user, thêm flag riêng
        return done(null, { ...user, isNew });
      } catch (err) {
        console.error("❌ Google login error:", err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
