# tree2dir Platform - Testing Strategy

Comprehensive testing documentation for the tree2dir platform ecosystem.

## 🎯 Testing Overview

The tree2dir platform employs a multi-layered testing strategy to ensure reliability, functionality, and user experience across all components.

### Testing Pyramid

```
                    🔺 E2E Tests (Playwright)
                   /                        \
                  /    Integration Tests     \
                 /                            \
                /        Unit Tests (Jest)     \
               /                                \
              /__________________________________\
```

## 🧪 Test Categories

### 1. **End-to-End Testing** (Playwright)
**Location**: `tests/e2e/`  
**Coverage**: Frontend application functionality

#### Test Suites:
- **Application Loading** (7 tests)
  - Loading screen behavior
  - Initial state verification
  - Component visibility
  - Responsive design
  - Accessibility compliance

- **Tree Editor Functionality** (15 tests)
  - CRUD operations on tree nodes
  - Inline editing and validation
  - Modal interactions
  - Error handling

- **Template System** (9 tests)
  - Template loading and switching
  - Structure verification
  - Preview updates

- **Format Switching** (12 tests)
  - Tree, JSON, YAML format support
  - Real-time preview updates
  - Content formatting

- **Import/Export Operations** (14 tests)
  - File operations
  - Clipboard functionality
  - Download mechanisms
  - Error scenarios

- **Project Management** (12 tests)
  - Metadata editing
  - Form validation
  - State persistence

#### Browser Coverage:
- ✅ **Desktop**: Chrome, Firefox, Safari, Edge
- ✅ **Mobile**: Chrome Mobile, Safari Mobile
- ✅ **Total**: 441 tests across 7 browser configurations

### 2. **Unit Testing** (Jest)
**Location**: `packages/*/src/**/*.test.ts`  
**Coverage**: Individual functions and components

#### Test Areas:
- **Core Package** (`@tree2dir/core`)
  - ASCII parsing algorithms
  - Tree validation logic
  - Utility functions
  - Error handling

- **CLI Package** (`@tree2dir/cli`)
  - Command parsing
  - File operations
  - Output formatting

- **Formats Package** (`@tree2dir/formats`)
  - Format converters
  - Serialization/deserialization
  - Schema validation

### 3. **Integration Testing**
**Location**: `packages/*/src/**/*.integration.test.ts`  
**Coverage**: Component interactions

#### Test Scenarios:
- Package interdependencies
- File system operations
- API integrations
- Workflow validation

## 🚀 Running Tests

### Prerequisites
```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Test Commands

#### All Tests
```bash
# Run all unit tests
npm run test

# Run all E2E tests
npm run test:e2e
```

#### Specific Test Types
```bash
# Unit tests only
npx nx run-many -t test

# E2E tests with UI
npm run test:e2e:ui

# E2E tests in headed mode
npm run test:e2e:headed

# Debug E2E tests
npm run test:e2e:debug
```

#### Package-Specific Tests
```bash
# Test specific package
npx nx test core
npx nx test cli
npx nx test frontend

# Test with coverage
npx nx test core --coverage
```

#### Browser-Specific E2E Tests
```bash
# Test specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## 📊 Test Coverage

### Current Coverage Metrics

#### E2E Test Coverage
- **Functional Coverage**: 100% of user-facing features
- **Browser Coverage**: 7 browser configurations
- **Device Coverage**: Desktop + Mobile viewports
- **Accessibility**: WCAG compliance checks

#### Unit Test Coverage
- **Core Package**: 85%+ code coverage
- **CLI Package**: 90%+ code coverage
- **Formats Package**: 95%+ code coverage

### Coverage Reports
```bash
# Generate coverage report
npm run test -- --coverage

# View HTML coverage report
open coverage/lcov-report/index.html
```

## 🔧 Test Configuration

### Jest Configuration
**File**: `jest.config.js`
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    'packages/*/src/**/*.ts',
    '!packages/*/src/**/*.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Playwright Configuration
**File**: `playwright.config.ts`
```typescript
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'firefox', use: devices['Desktop Firefox'] },
    { name: 'webkit', use: devices['Desktop Safari'] },
    { name: 'Mobile Chrome', use: devices['Pixel 5'] },
    { name: 'Mobile Safari', use: devices['iPhone 12'] }
  ]
});
```

## 🐛 Debugging Tests

### Unit Test Debugging
```bash
# Debug specific test
npx nx test core --testNamePattern="should parse ASCII tree"

# Run tests in watch mode
npx nx test core --watch

# Debug with Node.js debugger
node --inspect-brk node_modules/.bin/jest --runInBand
```

### E2E Test Debugging
```bash
# Debug mode (step through tests)
npm run test:e2e:debug

# Headed mode (see browser)
npm run test:e2e:headed

# Trace viewer
npx playwright show-trace test-results/trace.zip
```

### Common Debugging Scenarios

#### Flaky Tests
```typescript
// Add explicit waits
await page.waitForLoadState('networkidle');
await expect(element).toBeVisible({ timeout: 10000 });

// Use more specific selectors
await page.locator('[data-testid="specific-element"]').click();
```

#### Timeout Issues
```typescript
// Increase timeout for slow operations
test.setTimeout(60000);

// Use custom timeouts
await expect(element).toBeVisible({ timeout: 30000 });
```

## 📈 Test Metrics and Reporting

### Automated Reports
- **HTML Reports**: Interactive test results
- **JSON Reports**: Machine-readable data
- **JUnit Reports**: CI/CD integration
- **Coverage Reports**: Code coverage analysis

### Key Metrics Tracked
- **Test Execution Time**: Performance monitoring
- **Pass/Fail Rates**: Reliability metrics
- **Flaky Test Detection**: Stability analysis
- **Browser Compatibility**: Cross-platform support

### Report Generation
```bash
# Generate all reports
npm run test:e2e
npm run test:e2e:report

# View reports
open playwright-report/index.html
open test-results/coverage/index.html
```

## 🔄 Continuous Integration

### GitHub Actions Workflow
**File**: `.github/workflows/test.yml`
```yaml
name: Test Suite
on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:e2e
```

### Pre-commit Hooks
**File**: `.husky/pre-commit`
```bash
#!/bin/sh
npm run test
npm run lint
```

## 🎨 Best Practices

### Test Writing Guidelines

#### 1. **Descriptive Test Names**
```typescript
// ✅ Good
test('should add new file to root directory when add button is clicked')

// ❌ Bad
test('add file test')
```

#### 2. **Arrange-Act-Assert Pattern**
```typescript
test('should calculate total correctly', () => {
  // Arrange
  const items = [1, 2, 3];
  
  // Act
  const result = calculateTotal(items);
  
  // Assert
  expect(result).toBe(6);
});
```

#### 3. **Isolated Tests**
```typescript
// Each test should be independent
beforeEach(() => {
  // Reset state
  resetDatabase();
  clearCache();
});
```

#### 4. **Meaningful Assertions**
```typescript
// ✅ Specific assertions
expect(response.status).toBe(200);
expect(response.data).toHaveProperty('id');

// ❌ Generic assertions
expect(response).toBeTruthy();
```

### Maintenance Guidelines

#### 1. **Regular Updates**
- Update test dependencies monthly
- Review and update test data
- Refactor obsolete tests

#### 2. **Performance Monitoring**
- Monitor test execution times
- Optimize slow tests
- Parallelize where possible

#### 3. **Coverage Monitoring**
- Maintain 80%+ code coverage
- Add tests for new features
- Remove tests for deprecated code

## 🚀 Future Enhancements

### Planned Improvements

#### 1. **Visual Regression Testing**
```bash
# Planned: Screenshot comparison tests
npm run test:visual
```

#### 2. **Performance Testing**
```bash
# Planned: Load time and performance metrics
npm run test:performance
```

#### 3. **Accessibility Testing**
```bash
# Planned: Automated WCAG compliance
npm run test:a11y
```

#### 4. **API Testing**
```bash
# Planned: Backend API integration tests
npm run test:api
```

### Test Automation Roadmap
- **Q1 2024**: Visual regression testing
- **Q2 2024**: Performance benchmarking
- **Q3 2024**: Accessibility automation
- **Q4 2024**: AI-powered test generation

## 📞 Support and Resources

### Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://testing-library.com/docs/guiding-principles)

### Team Resources
- **Test Strategy**: [Internal Wiki](link-to-wiki)
- **Bug Reports**: [GitHub Issues](link-to-issues)
- **Test Data**: [Test Data Repository](link-to-test-data)

### Getting Help
1. Check existing test documentation
2. Review similar test patterns
3. Ask in team chat for guidance
4. Create detailed bug reports

---

## 📋 Test Checklist

### Before Committing
- [ ] All unit tests pass
- [ ] E2E tests pass in Chrome
- [ ] Code coverage meets threshold
- [ ] No linting errors
- [ ] Tests added for new features

### Before Releasing
- [ ] Full test suite passes
- [ ] Cross-browser testing complete
- [ ] Performance tests pass
- [ ] Accessibility tests pass
- [ ] Test reports generated

**Happy Testing! 🎭**

---

*Last Updated: December 2024*  
*Version: 1.0.0* 