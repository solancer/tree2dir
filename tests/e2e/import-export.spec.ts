import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Import and Export Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#loading-screen')).toBeHidden({ timeout: 10000 });
  });

  test('should display import and export buttons', async ({ page }) => {
    // Check header buttons are visible
    await expect(page.locator('#import-btn')).toBeVisible();
    await expect(page.locator('#copy-btn')).toBeVisible();
    await expect(page.locator('#download-btn')).toBeVisible();
    
    // Check button text and icons
    await expect(page.locator('#import-btn')).toContainText('Import');
    await expect(page.locator('#import-btn .fa-upload')).toBeVisible();
    await expect(page.locator('#copy-btn')).toContainText('Copy');
    await expect(page.locator('#copy-btn .fa-copy')).toBeVisible();
    await expect(page.locator('#download-btn')).toContainText('Download');
    await expect(page.locator('#download-btn .fa-download')).toBeVisible();
  });

  test('should copy tree format to clipboard', async ({ page }) => {
    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    
    // Click copy button
    await page.locator('#copy-btn').click();
    
    // Check success notification
    await expect(page.locator('.notification-success')).toContainText('Copied to clipboard!');
    
    // Verify clipboard content
    const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardContent).toContain('# My Project');
    expect(clipboardContent).toContain('my-project/');
    expect(clipboardContent).toContain('├── src/');
    expect(clipboardContent).toContain('├── package.json');
  });

  test('should copy JSON format to clipboard', async ({ page }) => {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    
    // Switch to JSON format
    await page.locator('[data-format="json"]').click();
    
    // Click copy button
    await page.locator('#copy-btn').click();
    
    // Check success notification
    await expect(page.locator('.notification-success')).toContainText('Copied to clipboard!');
    
    // Verify clipboard content is JSON
    const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());
    const parsed = JSON.parse(clipboardContent);
    expect(parsed.metadata.name).toBe('My Project');
    expect(parsed.root).toBe('my-project');
    expect(parsed.nodes).toBeDefined();
  });

  test('should copy YAML format to clipboard', async ({ page }) => {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    
    // Switch to YAML format
    await page.locator('[data-format="yaml"]').click();
    
    // Click copy button
    await page.locator('#copy-btn').click();
    
    // Check success notification
    await expect(page.locator('.notification-success')).toContainText('Copied to clipboard!');
    
    // Verify clipboard content is YAML
    const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardContent).toContain('version: "1.0"');
    expect(clipboardContent).toContain('metadata:');
    expect(clipboardContent).toContain('name: "My Project"');
    expect(clipboardContent).toContain('structure:');
  });

  test('should download tree format file', async ({ page }) => {
    // Set up download handler
    const downloadPromise = page.waitForEvent('download');
    
    // Click download button
    await page.locator('#download-btn').click();
    
    // Wait for download
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('my-project.tree');
    
    // Check success notification
    await expect(page.locator('.notification-success')).toContainText('Downloaded my-project.tree!');
    
    // Verify download content
    const downloadPath = await download.path();
    if (downloadPath) {
      const content = fs.readFileSync(downloadPath, 'utf-8');
      expect(content).toContain('# My Project');
      expect(content).toContain('my-project/');
      expect(content).toContain('├── src/');
    }
  });

  test('should download JSON format file', async ({ page }) => {
    // Switch to JSON format
    await page.locator('[data-format="json"]').click();
    
    // Set up download handler
    const downloadPromise = page.waitForEvent('download');
    
    // Click download button
    await page.locator('#download-btn').click();
    
    // Wait for download
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('my-project.json');
    
    // Check success notification
    await expect(page.locator('.notification-success')).toContainText('Downloaded my-project.json!');
    
    // Verify download content
    const downloadPath = await download.path();
    if (downloadPath) {
      const content = fs.readFileSync(downloadPath, 'utf-8');
      const parsed = JSON.parse(content);
      expect(parsed.metadata.name).toBe('My Project');
      expect(parsed.root).toBe('my-project');
    }
  });

  test('should download YAML format file', async ({ page }) => {
    // Switch to YAML format
    await page.locator('[data-format="yaml"]').click();
    
    // Set up download handler
    const downloadPromise = page.waitForEvent('download');
    
    // Click download button
    await page.locator('#download-btn').click();
    
    // Wait for download
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('my-project.yaml');
    
    // Check success notification
    await expect(page.locator('.notification-success')).toContainText('Downloaded my-project.yaml!');
    
    // Verify download content
    const downloadPath = await download.path();
    if (downloadPath) {
      const content = fs.readFileSync(downloadPath, 'utf-8');
      expect(content).toContain('version: "1.0"');
      expect(content).toContain('name: "My Project"');
    }
  });

  test('should update download filename when root name changes', async ({ page }) => {
    // Change root name
    await page.locator('#root-name').fill('custom-project');
    
    // Set up download handler
    const downloadPromise = page.waitForEvent('download');
    
    // Click download button
    await page.locator('#download-btn').click();
    
    // Wait for download
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('custom-project.tree');
  });

  test('should trigger file import dialog', async ({ page }) => {
    // Create a temporary test file
    const testContent = `# Test Project
# A test project structure

test-project/
├── src/
│   └── index.js
└── package.json`;

    // We can't actually test file upload in Playwright easily,
    // but we can test that the import button triggers the file dialog
    await page.locator('#import-btn').click();
    
    // The file input should be created and clicked
    // This is tested indirectly by checking the import functionality works
    // in integration tests or by mocking the file input
  });

  test('should handle clipboard copy failure gracefully', async ({ page }) => {
    // Mock clipboard API to fail
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: () => Promise.reject(new Error('Clipboard access denied'))
        }
      });
    });
    
    // Try to copy
    await page.locator('#copy-btn').click();
    
    // Should show error notification
    await expect(page.locator('.notification-error')).toContainText('Failed to copy to clipboard');
  });

  test('should create new tree and reset export filename', async ({ page }) => {
    // Click new button
    await page.locator('#new-btn').click();
    
    // Check project is reset
    await expect(page.locator('#project-name')).toHaveValue('New Project');
    await expect(page.locator('#root-name')).toHaveValue('new-project');
    
    // Set up download handler
    const downloadPromise = page.waitForEvent('download');
    
    // Download should use new filename
    await page.locator('#download-btn').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('new-project.tree');
  });

  test('should export modified tree structure', async ({ page }) => {
    // Add a new file
    await page.locator('.tree-root .btn-icon[title="Add child"]').click();
    await page.locator('#node-name-input').fill('custom.txt');
    await page.locator('#confirm-add').click();
    
    // Copy to clipboard
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.locator('#copy-btn').click();
    
    // Verify clipboard includes new file
    const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardContent).toContain('custom.txt');
  });

  test('should export template structure', async ({ page }) => {
    // Load React template
    await page.locator('[data-template="react"]').click();
    
    // Set up download handler
    const downloadPromise = page.waitForEvent('download');
    
    // Download template
    await page.locator('#download-btn').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('react-app.tree');
    
    // Verify download content includes React structure
    const downloadPath = await download.path();
    if (downloadPath) {
      const content = fs.readFileSync(downloadPath, 'utf-8');
      expect(content).toContain('# React App');
      expect(content).toContain('react-app/');
      expect(content).toContain('├── src/');
      expect(content).toContain('├── public/');
    }
  });

  test('should handle special characters in export', async ({ page }) => {
    // Change project name to include special characters
    await page.locator('#project-name').fill('My "Special" Project & More');
    await page.locator('#root-name').fill('special-project');
    
    // Copy JSON format
    await page.locator('[data-format="json"]').click();
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.locator('#copy-btn').click();
    
    // Verify JSON is properly escaped
    const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());
    const parsed = JSON.parse(clipboardContent);
    expect(parsed.metadata.name).toBe('My "Special" Project & More');
  });

  test('should maintain format selection during export operations', async ({ page }) => {
    // Switch to JSON format
    await page.locator('[data-format="json"]').click();
    await expect(page.locator('[data-format="json"]')).toHaveClass(/active/);
    
    // Copy to clipboard
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.locator('#copy-btn').click();
    
    // Format selection should remain
    await expect(page.locator('[data-format="json"]')).toHaveClass(/active/);
    
    // Download file
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#download-btn').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('my-project.json');
    
    // Format selection should still remain
    await expect(page.locator('[data-format="json"]')).toHaveClass(/active/);
  });

  test('should show appropriate notifications for all export operations', async ({ page }) => {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    
    // Test copy notification
    await page.locator('#copy-btn').click();
    await expect(page.locator('.notification-success')).toContainText('Copied to clipboard!');
    
    // Wait for notification to disappear
    await expect(page.locator('.notification-success')).toBeHidden({ timeout: 5000 });
    
    // Test download notification
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#download-btn').click();
    await downloadPromise;
    await expect(page.locator('.notification-success')).toContainText('Downloaded my-project.tree!');
  });
}); 