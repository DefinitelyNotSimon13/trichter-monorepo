BEGIN;

-- user
ALTER TABLE "user" RENAME COLUMN email_verified TO "emailVerified";
ALTER TABLE "user" RENAME COLUMN created_at TO "createdAt";
ALTER TABLE "user" RENAME COLUMN updated_at TO "updatedAt";
ALTER TABLE "user" RENAME COLUMN ban_reason TO "banReason";
ALTER TABLE "user" RENAME COLUMN ban_expires TO "banExpires";
ALTER TABLE "user" RENAME COLUMN display_username TO "displayUsername";

-- verification
ALTER TABLE verification RENAME COLUMN expires_at TO "expiresAt";
ALTER TABLE verification RENAME COLUMN created_at TO "createdAt";
ALTER TABLE verification RENAME COLUMN updated_at TO "updatedAt";

-- session
ALTER TABLE session RENAME COLUMN expires_at TO "expiresAt";
ALTER TABLE session RENAME COLUMN created_at TO "createdAt";
ALTER TABLE session RENAME COLUMN updated_at TO "updatedAt";
ALTER TABLE session RENAME COLUMN ip_address TO "ipAddress";
ALTER TABLE session RENAME COLUMN user_agent TO "userAgent";
ALTER TABLE session RENAME COLUMN user_id TO "userId";
ALTER TABLE session RENAME COLUMN impersonated_by TO "impersonatedBy";

-- account
ALTER TABLE "account" RENAME COLUMN account_id TO "accountId";
ALTER TABLE "account" RENAME COLUMN provider_id TO "providerId";
ALTER TABLE "account" RENAME COLUMN user_id TO "userId";
ALTER TABLE "account" RENAME COLUMN access_token TO "accessToken";
ALTER TABLE "account" RENAME COLUMN refresh_token TO "refreshToken";
ALTER TABLE "account" RENAME COLUMN id_token TO "idToken";
ALTER TABLE "account" RENAME COLUMN access_token_expires_at TO "accessTokenExpiresAt";
ALTER TABLE "account" RENAME COLUMN refresh_token_expires_at TO "refreshTokenExpiresAt";
ALTER TABLE "account" RENAME COLUMN created_at TO "createdAt";
ALTER TABLE "account" RENAME COLUMN updated_at TO "updatedAt";

COMMIT;
