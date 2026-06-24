# Official Playwright image — has all browsers!
FROM mcr.microsoft.com/playwright:v1.45.0-jammy

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all project files
COPY . .

# Default command
CMD ["npx", "playwright", "test", \
  "tests/hard-assertions.spec.ts", \
  "tests/negative-assertions.spec.ts", \
  "tests/numeric-assertions.spec.ts", \
  "tests/api-testing.spec.ts", \
  "tests/crud-api.spec.ts", \
  "--project=chromium"]