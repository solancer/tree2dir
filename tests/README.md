# tree2dir Frontend - Playwright Test Suite

Comprehensive end-to-end testing for the tree2dir visual tree editor using Playwright.

## 🧪 Test Overview

Our test suite covers all major functionality of the frontend application:

### Test Categories

1. **Application Loading** (`app-loading.spec.ts`)
   - Loading screen behavior
   - Initial application state
   - UI component visibility
   - Responsive design
   - Accessibility features

2. **Tree Editor Functionality** (`tree-editor.spec.ts`)
   - Adding files and directories
   - Inline editing and renaming
   - Deleting nodes with confirmation
   - Node action visibility
   - Modal operations
   - Validation and error handling

3. **Template System** (`templates.spec.ts`)
   - Template button display and interaction
   - Loading React, Node.js, Python, and Vue.js templates
   - Template structure verification
   - Template switching behavior
   - Preview updates

4. **Preview and Formats** (`preview-formats.spec.ts`)
   - Format selector functionality
   - Tree, JSON, and YAML format switching
   - Real-time preview updates
   - Content formatting and structure
   - Special character handling

5. **Import/Export Operations** (`import-export.spec.ts`)
   - Clipboard operations (copy/paste)
   - File download functionality
   - Format-specific exports
   - Error handling
   - Notification system

6. **Project Management** (`project-management.spec.ts`)
   - Project metadata editing
   - New project creation
   - Form validation
   - State persistence
   - Special character handling

## 🚀 Running Tests

### Prerequisites
- Node.js 18+
- Frontend application running on `http://localhost:3001`

### Installation
```bash
# Install Playwright (already done)
npm install --save-dev @playwright/test
npx playwright install
```

### Test Commands

#### Run All Tests
```bash
npm run test:e2e
```

#### Interactive UI Mode
```bash
npm run test:e2e:ui
```

#### Headed Mode (See Browser)
```bash
npm run test:e2e:headed
```

#### Debug Mode
```bash
npm run test:e2e:debug
```

#### View Test Report
```bash
npm run test:e2e:report
```

#### Run Specific Test File
```bash
npx playwright test tests/e2e/tree-editor.spec.ts
```

#### Run Tests in Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## 🔧 Configuration

### Browser Support
- **Desktop**: Chrome, Firefox, Safari, Edge
- **Mobile**: Chrome Mobile, Safari Mobile
- **Headless**: All browsers support headless mode

### Test Settings
- **Base URL**: `http://localhost:3001`
- **Timeout**: 30 seconds per test
- **Retries**: 2 retries on CI, 0 locally
- **Parallel**: Full parallel execution
- **Screenshots**: On failure only
- **Videos**: Retained on failure
- **Traces**: On first retry

### Reports
- **HTML Report**: Interactive test results
- **JSON Report**: Machine-readable results
- **JUnit Report**: CI/CD integration

## 📝 Test Structure

### Test Organization
```
tests/
├── e2e/
│   ├── app-loading.spec.ts       # Application initialization
│   ├── tree-editor.spec.ts       # Core editing functionality
│   ├── templates.spec.ts         # Template system
│   ├── preview-formats.spec.ts   # Format switching
│   ├── import-export.spec.ts     # File operations
│   └── project-management.spec.ts # Project metadata
└── README.md                     # This file
```

### Test Patterns

#### Page Object Model
```typescript
// Locators are defined inline for clarity
const addButton = page.locator('#add-node-btn');
const modal = page.locator('#add-node-modal');
```

#### Async/Await Pattern
```typescript
test('should add new file', async ({ page }) => {
  await page.goto('/');
  await page.locator('#add-btn').click();
  await expect(page.locator('#modal')).toBeVisible();
});
```

#### Setup and Teardown
```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('#loading-screen')).toBeHidden();
});
```

## 🎯 Test Coverage

### Functional Coverage
- ✅ **Application Loading**: 7 tests
- ✅ **Tree Operations**: 15 tests  
- ✅ **Template System**: 9 tests
- ✅ **Format Switching**: 12 tests
- ✅ **Import/Export**: 14 tests
- ✅ **Project Management**: 12 tests

### Browser Coverage
- ✅ **Chromium**: Full test suite
- ✅ **Firefox**: Full test suite
- ✅ **WebKit**: Full test suite
- ✅ **Mobile Chrome**: Responsive tests
- ✅ **Mobile Safari**: Responsive tests

### Feature Coverage
- ✅ **UI Components**: All major components tested
- ✅ **User Interactions**: Click, hover, keyboard, form input
- ✅ **Data Operations**: CRUD operations on tree nodes
- ✅ **File Operations**: Import, export, clipboard
- ✅ **Error Handling**: Validation, notifications, edge cases
- ✅ **Responsive Design**: Mobile and desktop layouts

## 🐛 Debugging Tests

### Debug Mode
```bash
npm run test:e2e:debug
```
- Opens browser in debug mode
- Allows step-by-step execution
- Inspector tools available

### Screenshots and Videos
- Screenshots taken on test failure
- Videos recorded for failed tests
- Stored in `test-results/` directory

### Trace Viewer
```bash
npx playwright show-trace test-results/trace.zip
```
- Timeline of test execution
- DOM snapshots at each step
- Network activity
- Console logs

### Common Issues

#### Test Timeouts
```typescript
// Increase timeout for slow operations
await expect(page.locator('#slow-element')).toBeVisible({ timeout: 10000 });
```

#### Element Not Found
```typescript
// Wait for element to be available
await page.waitForSelector('#dynamic-element');
await page.locator('#dynamic-element').click();
```

#### Flaky Tests
```typescript
// Use more specific selectors
await page.locator('[data-testid="specific-button"]').click();

// Wait for network requests
await page.waitForLoadState('networkidle');
```

## 📊 Test Reports

### HTML Report
- Interactive test results
- Screenshots and videos
- Error details and stack traces
- Browser-specific results

### CI/CD Integration
- JUnit XML format for CI systems
- JSON format for custom processing
- Exit codes for build pipeline integration

### Metrics Tracked
- Test execution time
- Pass/fail rates by browser
- Flaky test identification
- Coverage metrics

## 🔄 Continuous Integration

### GitHub Actions Example
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:e2e
```

### Local Development
```bash
# Start frontend in background
npm run serve:frontend &

# Run tests
npm run test:e2e

# Stop frontend
pkill -f "http-server"
```

## 🎨 Best Practices

### Test Writing
1. **Descriptive Names**: Clear test descriptions
2. **Single Responsibility**: One feature per test
3. **Proper Setup**: Consistent beforeEach setup
4. **Assertions**: Meaningful expect statements
5. **Error Handling**: Test both success and failure paths

### Maintenance
1. **Regular Updates**: Keep tests updated with UI changes
2. **Flaky Test Fixes**: Address intermittent failures
3. **Performance**: Monitor test execution time
4. **Coverage**: Ensure new features have tests

### Code Quality
1. **TypeScript**: Full type safety
2. **Linting**: ESLint configuration
3. **Formatting**: Prettier integration
4. **Documentation**: Inline comments for complex tests

## 🚀 Future Enhancements

### Planned Additions
- **Visual Regression Testing**: Screenshot comparisons
- **Performance Testing**: Load time measurements
- **Accessibility Testing**: WCAG compliance checks
- **API Testing**: Backend integration tests
- **Cross-browser Testing**: Extended browser matrix

### Test Automation
- **Auto-retry**: Intelligent retry logic
- **Parallel Execution**: Optimized test distribution
- **Test Sharding**: Split tests across multiple machines
- **Smart Test Selection**: Run only affected tests

---

## 📞 Support

For test-related issues:
1. Check the [Playwright Documentation](https://playwright.dev/)
2. Review test logs and screenshots
3. Use debug mode for investigation
4. Create issues with reproduction steps

**Happy Testing! 🎭** 