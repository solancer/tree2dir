import { test, expect } from '@playwright/test';

test.describe('Template Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#loading-screen')).toBeHidden({ timeout: 10000 });
  });

  test('should display all template buttons', async ({ page }) => {
    // Check all template buttons are visible
    await expect(page.locator('[data-template="react"]')).toBeVisible();
    await expect(page.locator('[data-template="node"]')).toBeVisible();
    await expect(page.locator('[data-template="python"]')).toBeVisible();
    await expect(page.locator('[data-template="vue"]')).toBeVisible();
    
    // Check template button content
    await expect(page.locator('[data-template="react"]')).toContainText('React App');
    await expect(page.locator('[data-template="node"]')).toContainText('Node.js API');
    await expect(page.locator('[data-template="python"]')).toContainText('Python Package');
    await expect(page.locator('[data-template="vue"]')).toContainText('Vue.js App');
    
    // Check icons are present
    await expect(page.locator('[data-template="react"] .fa-react')).toBeVisible();
    await expect(page.locator('[data-template="node"] .fa-node-js')).toBeVisible();
    await expect(page.locator('[data-template="python"] .fa-python')).toBeVisible();
    await expect(page.locator('[data-template="vue"] .fa-vuejs')).toBeVisible();
  });

  test('should load React template', async ({ page }) => {
    // Click React template
    await page.locator('[data-template="react"]').click();
    
    // Check project metadata is updated
    await expect(page.locator('#project-name')).toHaveValue('React App');
    await expect(page.locator('#root-name')).toHaveValue('react-app');
    await expect(page.locator('#project-description')).toHaveValue('Modern React application');
    
    // Check React-specific structure
    await expect(page.locator('.tree-root .tree-node-name')).toContainText('react-app/');
    await expect(page.locator('.tree-node').filter({ hasText: 'src/' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'public/' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'components/' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'hooks/' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'utils/' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'App.tsx' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'Header.tsx' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'index.tsx' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'index.html' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'package.json' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'tsconfig.json' })).toBeVisible();
    
    // Success notification should appear
    await expect(page.locator('.notification-success')).toContainText('React App template loaded!');
  });

  test('should load Node.js template', async ({ page }) => {
    // Click Node.js template
    await page.locator('[data-template="node"]').click();
    
    // Check project metadata
    await expect(page.locator('#project-name')).toHaveValue('Node.js API');
    await expect(page.locator('#root-name')).toHaveValue('api-server');
    await expect(page.locator('#project-description')).toHaveValue('Express.js API server');
    
    // Check Node.js-specific structure
    await expect(page.locator('.tree-root .tree-node-name')).toContainText('api-server/');
    await expect(page.locator('.tree-node').filter({ hasText: 'src/' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'routes/' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'middleware/' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'models/' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'controllers/' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'app.js' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'tests/' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'package.json' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'README.md' })).toBeVisible();
    
    // Success notification
    await expect(page.locator('.notification-success')).toContainText('Node.js API template loaded!');
  });

  test('should load Python template', async ({ page }) => {
    // Click Python template
    await page.locator('[data-template="python"]').click();
    
    // Check project metadata
    await expect(page.locator('#project-name')).toHaveValue('Python Package');
    await expect(page.locator('#root-name')).toHaveValue('my-package');
    await expect(page.locator('#project-description')).toHaveValue('Python package structure');
    
    // Check Python-specific structure
    await expect(page.locator('.tree-root .tree-node-name')).toContainText('my-package/');
    await expect(page.locator('.tree-node').filter({ hasText: 'src/' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'my_package/' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: '__init__.py' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'main.py' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'tests/' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'setup.py' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'requirements.txt' })).toBeVisible();
    
    // Success notification
    await expect(page.locator('.notification-success')).toContainText('Python Package template loaded!');
  });

  test('should load Vue.js template', async ({ page }) => {
    // Click Vue.js template
    await page.locator('[data-template="vue"]').click();
    
    // Check project metadata
    await expect(page.locator('#project-name')).toHaveValue('Vue.js App');
    await expect(page.locator('#root-name')).toHaveValue('vue-app');
    await expect(page.locator('#project-description')).toHaveValue('Vue.js application');
    
    // Check Vue.js-specific structure
    await expect(page.locator('.tree-root .tree-node-name')).toContainText('vue-app/');
    await expect(page.locator('.tree-node').filter({ hasText: 'src/' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'components/' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'views/' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'router/' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'store/' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'main.ts' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'public/' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'package.json' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'vite.config.ts' })).toBeVisible();
    
    // Success notification
    await expect(page.locator('.notification-success')).toContainText('Vue.js App template loaded!');
  });

  test('should update preview when template is loaded', async ({ page }) => {
    // Load React template
    await page.locator('[data-template="react"]').click();
    
    // Check preview is updated
    const preview = page.locator('#preview-output');
    await expect(preview).toContainText('# React App');
    await expect(preview).toContainText('# Modern React application');
    await expect(preview).toContainText('react-app/');
    await expect(preview).toContainText('├── src/');
    await expect(preview).toContainText('├── public/');
    await expect(preview).toContainText('├── package.json');
    await expect(preview).toContainText('└── tsconfig.json');
  });

  test('should update parent select options when template is loaded', async ({ page }) => {
    // Load React template
    await page.locator('[data-template="react"]').click();
    
    // Open add node modal
    await page.locator('.tree-root .btn-icon[title="Add child"]').click();
    
    // Check parent select has template directories
    const parentSelect = page.locator('#parent-select');
    await expect(parentSelect.locator('option').filter({ hasText: 'Root (react-app)' })).toBeVisible();
    await expect(parentSelect.locator('option').filter({ hasText: 'src/' })).toBeVisible();
    await expect(parentSelect.locator('option').filter({ hasText: 'components/' })).toBeVisible();
    await expect(parentSelect.locator('option').filter({ hasText: 'public/' })).toBeVisible();
  });

  test('should switch between templates correctly', async ({ page }) => {
    // Load React template first
    await page.locator('[data-template="react"]').click();
    await expect(page.locator('#project-name')).toHaveValue('React App');
    
    // Switch to Node.js template
    await page.locator('[data-template="node"]').click();
    await expect(page.locator('#project-name')).toHaveValue('Node.js API');
    await expect(page.locator('#root-name')).toHaveValue('api-server');
    
    // Check React-specific files are gone
    await expect(page.locator('.tree-node').filter({ hasText: 'App.tsx' })).not.toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'tsconfig.json' })).not.toBeVisible();
    
    // Check Node.js-specific files are present
    await expect(page.locator('.tree-node').filter({ hasText: 'app.js' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'routes/' })).toBeVisible();
  });

  test('should preserve template structure when adding new nodes', async ({ page }) => {
    // Load React template
    await page.locator('[data-template="react"]').click();
    
    // Add a new file to components directory
    const componentsDir = page.locator('.tree-node').filter({ hasText: 'components/' });
    await componentsDir.hover();
    await componentsDir.locator('.btn-icon[title="Add child"]').click();
    
    await page.locator('#node-name-input').fill('Button.tsx');
    await page.locator('#node-type-select').selectOption('file');
    await page.locator('#confirm-add').click();
    
    // New file should be added to the template structure
    await expect(page.locator('.tree-node').filter({ hasText: 'Button.tsx' })).toBeVisible();
    
    // Original template files should still be present
    await expect(page.locator('.tree-node').filter({ hasText: 'App.tsx' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'Header.tsx' })).toBeVisible();
  });

  test('should handle template hover effects', async ({ page }) => {
    const reactBtn = page.locator('[data-template="react"]');
    
    // Check initial state
    await expect(reactBtn).toHaveCSS('background-color', 'rgb(255, 255, 255)'); // white
    
    // Hover should change appearance
    await reactBtn.hover();
    await expect(reactBtn).toHaveCSS('background-color', 'rgb(34, 197, 94)'); // primary green
    await expect(reactBtn).toHaveCSS('color', 'rgb(255, 255, 255)'); // white text
  });

  test('should maintain template selection state', async ({ page }) => {
    // Load Python template
    await page.locator('[data-template="python"]').click();
    
    // Refresh page
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#loading-screen')).toBeHidden({ timeout: 10000 });
    
    // Should return to default template, not Python
    await expect(page.locator('#project-name')).toHaveValue('My Project');
    await expect(page.locator('#root-name')).toHaveValue('my-project');
  });
}); 