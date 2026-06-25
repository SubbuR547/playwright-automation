# Playwright Automation Framework

A complete end-to-end test automation framework built with Playwright and TypeScript.

## Tech Stack

| Tool | Purpose |
|------|---------|
| Playwright | Browser automation |
| TypeScript | Programming language |
| Node.js 20 | Runtime environment |
| GitHub Actions | CI/CD pipeline |
| Docker | Containerization |

## Project Structure
tests/

assertions/  → hard, soft, negative, numeric, polling, custom

api/         → GET, POST, PUT, PATCH, DELETE, hybrid

ui/          → multi-tab, multi-user, parallel

network/     → mock and intercept

pages/         → Page Object Models

fixtures/      → Custom fixtures

data/          → Test data

utils/         → Helper functions

## Setup

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/SubbuR547/playwright-automation.git
npm ci
npx playwright install
```

### Environment Variables

Create `.env` file in root:

SAUCE_USERNAME=standard_user

SAUCE_PASSWORD=secret_sauce

## Running Tests

```bash
# Run all tests
npx playwright test

# Run specific folder
npx playwright test tests/assertions/
npx playwright test tests/api/
npx playwright test tests/ui/

# Run specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run headed
npx playwright test --headed

# Show report
npx playwright show-report
```

## CI/CD Workflows

| Workflow | Purpose | Browsers |
|----------|---------|---------|
| Playwright Tests | Quick check on every push | Chromium |
| Matrix Tests | Cross browser testing | Chrome + Firefox + Safari |
| Docker Tests | Containerized environment | Chromium |

## Docker

```bash
docker build -t playwright-tests .
docker run playwright-tests
docker-compose up playwright
```

## Test Categories

| Category | Folder | Tests |
|----------|--------|-------|
| Assertions | tests/assertions/ | Hard, Soft, Negative, Numeric, Polling, Custom |
| API Testing | tests/api/ | GET, POST, PUT, PATCH, DELETE, Hybrid |
| UI Testing | tests/ui/ | Multi-Tab, Multi-User, Parallel |
| Network | tests/network/ | Mock, Intercept, Block |

## Helper Functions

```typescript
import { loginToSauceDemo, addProductToCart, getCartCount } from '../utils/helpers';

await loginToSauceDemo(page);
await addProductToCart(page, 'sauce-labs-backpack');
const count = await getCartCount(page);
```

## Author

**Subbu R** — QA Automation Engineer
GitHub: https://github.com/SubbuR547