# Playwright Tests with Selenium Grid

This project is configured to run Playwright tests **ONLY** through Selenium Grid. Tests will not run on local browsers.

## Prerequisites

- Selenium Grid must be running at `http://localhost:4444`
- Chrome browser nodes must be available in the Grid
```
java -jar selenium-server-4.36.0.jar hub
```
```
java -jar selenium-server-4.36.0.jar node --detect-drivers true --publish-events tcp://localhost:4442 --subscribe-events tcp://localhost:4443
```

## Check Grid Status

Visit the Grid UI at: http://localhost:4444/ui/#

Or check status via command:
```powershell
Invoke-WebRequest -Uri "http://localhost:4444/status" | Select-Object -ExpandProperty Content
```

## Running Tests

### Default (Headless Mode - No Browser Window)
```powershell
npm test
```

### With Visible Browser (Headed Mode - For Debugging)
```powershell
npm run test:headed
```

### Environment Variables

**HEADLESS** - Control browser visibility
```powershell
# Headless mode (default) - No browser window opens
$env:HEADLESS = "true"
npm test

# Headed mode - Browser window is visible
$env:HEADLESS = "false"
npm test
```

**GRID_URL** - Customize Grid URL
```powershell
$env:GRID_URL = "http://your-grid-url:4444"
npm test
```

## Test Structure

- `grid-fixtures.ts` - Custom fixture that ensures Grid-only execution
- `global-setup.ts` - Validates Grid availability before any tests run
- `tests/example.spec.ts` - Example tests using `selenium-webdriver` API

## Important Notes

⚠️ **Tests will FAIL if:**
- Selenium Grid is not running
- No Chrome nodes are available
- Grid URL is incorrect

✅ **All tests run in Grid when:**
- You see "✓ Connected to Selenium Grid" in the output
- You see browser sessions in the Grid UI (http://localhost:4444/ui/#)

## Viewing Test Reports

After tests complete:
```powershell
npx playwright show-report
```

