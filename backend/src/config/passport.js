const passport = require("passport");

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;

const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("[DEBUG] Google OAuth Strategy - Profile received:", {
          id: profile.id,
          displayName: profile.displayName,
          emails: profile.emails,
          photos: profile.photos,
        });

        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if (!email) {
          console.error("[DEBUG] Google OAuth error - No email address found in profile");
          return done(new Error("No email address found in Google profile"), null);
        }

        // Search by googleId first, then by email
        let user = await User.findOne({
          $or: [
            { googleId: profile.id },
            { email: email }
          ]
        });

        if (!user) {
          console.log("[DEBUG] Google OAuth - Creating new user account");
          user = await User.create({
            name: profile.displayName,
            email: email,
            googleId: profile.id,
            avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : "",
            provider: "google",
          });
          console.log("[DEBUG] Google OAuth - New user registered successfully:", user._id);
        } else {
          console.log("[DEBUG] Google OAuth - Existing user found matching profile:", user._id);
          // Link Google ID if email matches but Google ID wasn't linked yet
          let updated = false;
          if (!user.googleId) {
            user.googleId = profile.id;
            updated = true;
          }
          if (profile.photos && profile.photos[0] && !user.avatar) {
            user.avatar = profile.photos[0].value;
            updated = true;
          }
          if (user.provider !== "google") {
            user.provider = "google";
            updated = true;
          }
          if (updated) {
            await user.save();
            console.log("[DEBUG] Google OAuth - Successfully linked Google ID to existing account");
          }
        }

        return done(null, user);
      } catch (error) {
        console.error("[DEBUG] Google OAuth Strategy Exception:", error);
        return done(error, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/auth/github/callback",
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("[DEBUG] GitHub OAuth Strategy - Profile received:", {
          id: profile.id,
          username: profile.username,
          emails: profile.emails,
          photos: profile.photos,
        });

        let email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

        if (!email) {
          email = `${profile.username || profile.id}@github.com`;
          console.warn("[DEBUG] GitHub OAuth - No public email found, falling back to synthetic email:", email);
        }

        // Search by githubId first, then by email
        let user = await User.findOne({
          $or: [
            { githubId: profile.id },
            { email: email }
          ]
        });

        if (!user) {
          console.log("[DEBUG] GitHub OAuth - Creating new user account");
          user = await User.create({
            name: profile.displayName || profile.username || "GitHub User",
            email: email,
            githubId: profile.id,
            avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : "",
            provider: "github",
          });
          console.log("[DEBUG] GitHub OAuth - New user registered successfully:", user._id);
        } else {
          console.log("[DEBUG] GitHub OAuth - Existing user found matching profile:", user._id);
          // Link GitHub ID if email matches but Google/GitHub ID wasn't linked yet
          let updated = false;
          if (!user.githubId) {
            user.githubId = profile.id;
            updated = true;
          }
          if (profile.photos && profile.photos[0] && !user.avatar) {
            user.avatar = profile.photos[0].value;
            updated = true;
          }
          if (user.provider !== "github" && !user.provider) {
            user.provider = "github";
            updated = true;
          }
          if (updated) {
            await user.save();
            console.log("[DEBUG] GitHub OAuth - Successfully linked GitHub ID to existing account");
          }
        }

        return done(null, user);
      } catch (error) {
        console.error("[DEBUG] GitHub OAuth Strategy Exception:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);

    done(null, user);
  } catch (error) {
    done(error, null);
  }
});