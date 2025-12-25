import { test, expect } from '@playwright/test';

test.describe('Application Loading', () => {
  test('should load the application successfully', async ({ page }) => {
    await page.goto('/');
    
    // Wait for loading screen to appear and disappear
    await expect(page.locator('#loading-screen')).toBeVisible();
    await expect(page.locator('#loading-screen')).toBeHidden({ timeout: 10000 });
    
    // Check main container is visible
    await expect(page.locator('#main-container')).toBeVisible();
    await expect(page.locator('.app-container')).toBeVisible();
  });

  test('should display correct page title and branding', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check page title
    await expect(page).toHaveTitle(/tree2dir/);
    
    // Check logo and branding
    await expect(page.locator('.logo h1')).toHaveText('tree2dir');
    await expect(page.locator('.logo .subtitle')).toHaveText('Visual Tree Editor');
    await expect(page.locator('.logo i.fa-sitemap')).toBeVisible();
  });

  test('should load with default project structure', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check default project is loaded
    await expect(page.locator('#project-name')).toHaveValue('My Project');
    await expect(page.locator('#root-name')).toHaveValue('my-project');
    await expect(page.locator('#project-description')).toHaveValue('A sample project structure');
    
    // Check default tree structure is visible
    await expect(page.locator('.tree-root')).toBeVisible();
    await expect(page.locator('.tree-node-name').first()).toContainText('my-project/');
  });

  test('should have all main UI components visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Header components
    await expect(page.locator('.app-header')).toBeVisible();
    await expect(page.locator('#new-btn')).toBeVisible();
    await expect(page.locator('#import-btn')).toBeVisible();
    await expect(page.locator('#copy-btn')).toBeVisible();
    await expect(page.locator('#download-btn')).toBeVisible();
    
    // Sidebar components
    await expect(page.locator('.sidebar')).toBeVisible();
    await expect(page.locator('.template-list')).toBeVisible();
    
    // Editor area
    await expect(page.locator('.editor-area')).toBeVisible();
    await expect(page.locator('.editor-panel')).toBeVisible();
    await expect(page.locator('.preview-panel')).toBeVisible();
    
    // Format selector
    await expect(page.locator('.format-selector')).toBeVisible();
    await expect(page.locator('[data-format="tree"]')).toBeVisible();
    await expect(page.locator('[data-format="json"]')).toBeVisible();
    await expect(page.locator('[data-format="yaml"]')).toBeVisible();
  });

  test('should display loading animation correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check loading screen elements
    const loadingScreen = page.locator('#loading-screen');
    await expect(loadingScreen).toBeVisible();
    
    await expect(page.locator('.loading-logo')).toBeVisible();
    await expect(page.locator('.loading-text')).toHaveText('tree2dir');
    await expect(page.locator('.loading-subtitle')).toHaveText('Visual Tree Editor');
    await expect(page.locator('.loading-spinner')).toBeVisible();
    
    // Wait for loading to complete
    await expect(loadingScreen).toBeHidden({ timeout: 10000 });
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check mobile layout
    await expect(page.locator('.app-main')).toBeVisible();
    await expect(page.locator('.sidebar')).toBeVisible();
    await expect(page.locator('.editor-area')).toBeVisible();
    
    // Check header is responsive
    await expect(page.locator('.header-content')).toBeVisible();
    await expect(page.locator('.header-actions')).toBeVisible();
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check form labels
    await expect(page.locator('label[for="project-name"]')).toBeVisible();
    await expect(page.locator('label[for="root-name"]')).toBeVisible();
    await expect(page.locator('label[for="project-description"]')).toBeVisible();
    
    // Check button accessibility
    await expect(page.locator('#new-btn')).toHaveAttribute('type', 'button');
    await expect(page.locator('#import-btn')).toHaveAttribute('type', 'button');
    
    // Check ARIA labels and roles where applicable
    await expect(page.locator('.btn-icon[title="Add child"]')).toHaveAttribute('title');
    await expect(page.locator('.btn-icon[title="Delete"]')).toHaveAttribute('title');
  });
}); 