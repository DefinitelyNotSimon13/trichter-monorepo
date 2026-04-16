#!/usr/bin/env bash
set -euo pipefail

AUTH_ENDPOINT="https://next.trichter.hauptspeicher.com/api/auth/oauth2/authorize"

CLIENT_ID="sNnVeFhzaOOoFaUbIVqLwYvEdZJfgMOE"
REDIRECT_URI="https://next.trichter.hauptspeicher.com/oauth/callback"
SCOPE="${SCOPE:-openid profile}"

if [[ -z "$CLIENT_ID" || -z "$REDIRECT_URI" ]]; then
  echo "Usage:"
  echo '  CLIENT_ID="my-client" REDIRECT_URI="http://localhost:3000/callback" ./oidc-authorize.sh'
  exit 1
fi

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing required command: $1" >&2
    exit 1
  }
}

require_cmd openssl
require_cmd curl

b64url() {
  openssl base64 -A | tr '+/' '-_' | tr -d '='
}

random_urlsafe() {
  openssl rand -base64 32 | tr '+/' '-_' | tr -d '=' | tr -d '\n'
}

urlencode() {
  local s="$1"
  local out=""
  local i c hex
  for ((i=0; i<${#s}; i++)); do
    c="${s:$i:1}"
    case "$c" in
      [a-zA-Z0-9.~_-]) out+="$c" ;;
      *)
        printf -v hex '%%%02X' "'$c"
        out+="$hex"
        ;;
    esac
  done
  printf '%s' "$out"
}

STATE="$(random_urlsafe)"
NONCE="$(random_urlsafe)"
CODE_VERIFIER="$(random_urlsafe)"
CODE_CHALLENGE="$(
  printf '%s' "$CODE_VERIFIER" \
    | openssl dgst -binary -sha256 \
    | b64url
)"

AUTH_URL="${AUTH_ENDPOINT}?client_id=$(urlencode "$CLIENT_ID")\
&redirect_uri=$(urlencode "$REDIRECT_URI")\
&response_type=code\
&scope=$(urlencode "$SCOPE")\
&state=$(urlencode "$STATE")\
&nonce=$(urlencode "$NONCE")\
&code_challenge=$(urlencode "$CODE_CHALLENGE")\
&code_challenge_method=S256"

COOKIE_JAR="$(mktemp)"
trap 'rm -f "$COOKIE_JAR"' EXIT

echo "Authorization URL:"
echo "$AUTH_URL"
echo
echo "PKCE values:"
echo "  state         = $STATE"
echo "  nonce         = $NONCE"
echo "  code_verifier = $CODE_VERIFIER"
echo "  code_challenge= $CODE_CHALLENGE"
echo
echo "Calling authorization endpoint with curl..."
echo

curl --silent --show-error \
  --include \
  --location \
  --cookie-jar "$COOKIE_JAR" \
  --cookie "$COOKIE_JAR" \
  "$AUTH_URL"
