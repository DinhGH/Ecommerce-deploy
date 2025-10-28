const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const { getUser, createUser } = require("../services/authService");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/user/facebook/callback`,
      profileFields: ["id", "displayName", "emails"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const fallbackEmail = `${profile.id}@facebook.temp`; // email tạm nếu không có
        const finalEmail = email || fallbackEmail;

        // 👉 kiểm tra user bằng email hoặc email tạm
        let user = await getUser(finalEmail);
        let isNew = false;

        if (!user) {
          // tạo user mới nếu chưa tồn tại
          user = await createUser({
            fullName: profile.displayName,
            email: finalEmail,
            password: "",
            phone: null,
            address: null,
            age: null,
            gender: null,
          });
          isNew = true;
        }

        return done(null, { ...user, isNew });
      } catch (err) {
        console.error("❌ Facebook login error:", err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
