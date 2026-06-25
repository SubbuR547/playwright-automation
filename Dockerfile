FROM mcr.microsoft.com/playwright:v1.60.0-jammy

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["npx", "playwright", "test", \
  "tests/assertions/hard-assertions.spec.ts", \
  "tests/assertions/negative-assertions.spec.ts", \
  "tests/assertions/numeric-assertions.spec.ts", \
  "tests/api/api-testing.spec.ts", \
  "tests/api/crud-api.spec.ts", \
  "--project=chromium", \
  "--workers=1"]