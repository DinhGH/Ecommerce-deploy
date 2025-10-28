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
        // 🟢 Lấy email hoặc tạo email ảo
        const email =
          profile.emails?.[0]?.value || `${profile.id}@facebook.temp`;

        // 🟢 Tìm user trong DB theo email
        let user = await getUser(email);
        let isNew = false;

        // 🟢 Nếu chưa có thì tạo mới
        if (!user) {
          user = await createUser({
            fullName: profile.displayName || "Facebook User",
            email,
            password: "",
            phone: null,
            address: null,
            age: null,
            gender: null,
            provider: "facebook",
            providerId: profile.id, // thêm để tra cứu chính xác
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
