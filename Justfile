set dotenv-load

repo_slug := `git config --get remote.origin.url | sed -E 's#^git@github\.com:##; s#^https://github\.com/##; s#\.git$##'`
repo_url := "https://github.com/{{repo_slug}}"
git_sha := `git rev-parse --short HEAD`
git_sha_full := `git rev-parse HEAD`
build_date := `date -u +'%Y-%m-%dT%H:%M:%SZ'`

backend_image := `printf 'ghcr.io/%s/backend' "$(git config --get remote.origin.url | sed -E 's#^git@github\.com:##; s#^https://github\.com/##; s#\.git$##')" | tr '[:upper:]' '[:lower:]'`
frontend_image := `printf 'ghcr.io/%s/frontend' "$(git config --get remote.origin.url | sed -E 's#^git@github\.com:##; s#^https://github\.com/##; s#\.git$##')" | tr '[:upper:]' '[:lower:]'`

default:
  @just --list

db-local file:
  psql "$DATABASE_URL_LOCAL" -v ON_ERROR_STOP=1 -f "{{file}}"

db-dev file:
  psql "$DATABASE_URL_DEV" -v ON_ERROR_STOP=1 -f "{{file}}"

db-prod file:
  psql "$DATABASE_URL_PROD" -v ON_ERROR_STOP=1 -f "{{file}}"


print-vars:
    @echo "repo_slug={{repo_slug}}"
    @echo "repo_url={{repo_url}}"
    @echo "git_sha={{git_sha}}"
    @echo "git_sha_full={{git_sha_full}}"
    @echo "build_date={{build_date}}"
    @echo "backend_image={{backend_image}}"
    @echo "frontend_image={{frontend_image}}"

fmt-frontend:
    cd frontend && bun run format --write

fmt-backend:
    @echo "TBD"
    # cd backend && ./gradlew spotlessApply --no-daemon

fmt:
    just fmt-frontend
    just fmt-backend

backend-build:
    cd backend && chmod +x gradlew && ./gradlew bootJar -PbuildId={{git_sha}} --no-daemon

frontend-install:
    cd frontend && bun install --frozen-lockfile

frontend-build:
    cd frontend && VITE_BUILD_ID={{git_sha}} bun run build

backend-docker:
    docker build \
      -f backend/Dockerfile \
      --build-arg REPO_URL={{repo_url}} \
      --build-arg VCS_REF={{git_sha_full}} \
      --build-arg BUILD_DATE={{build_date}} \
      -t {{backend_image}}:{{git_sha}} \
      -t {{backend_image}}:latest \
      .

frontend-docker:
    docker build \
      -f frontend/Dockerfile \
      --build-arg REPO_URL={{repo_url}} \
      --build-arg VCS_REF={{git_sha_full}} \
      --build-arg BUILD_DATE={{build_date}} \
      -t {{frontend_image}}:{{git_sha}} \
      -t {{frontend_image}}:latest \
      .

backend-push: backend-docker
    docker push {{backend_image}}:{{git_sha}}
    docker push {{backend_image}}:latest

frontend-push: frontend-docker
    docker push {{frontend_image}}:{{git_sha}}
    docker push {{frontend_image}}:latest

publish: backend-push frontend-push
