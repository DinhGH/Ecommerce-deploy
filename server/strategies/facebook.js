const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const { getUser, createUser } = require("../services/authService"); // service DB

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID, // KHÔNG có dấu ""
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/user/facebook/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value; // Facebook đôi khi không trả email
        let user = null;
        let isNew = false;

        if (email) {
          user = await getUser(email);
        }

        if (!user) {
          user = await createUser({
            fullName: profile.displayName,
            email: email || `${profile.id}@facebook.com`, // fallback nếu không có email
            password: "",
            phone: null,
            address: null,
            age: null,
            gender: null,
          });
          isNew = true;
        }

        // trả về user và flag
        return done(null, { ...user, isNew });
      } catch (err) {
        console.error("❌ Facebook login error:", err);
        console.error(err.stack);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
