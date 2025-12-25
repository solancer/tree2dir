import { test, expect } from '@playwright/test';

test.describe('Tree Editor Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Wait for loading screen to disappear
    await expect(page.locator('#loading-screen')).toBeHidden({ timeout: 10000 });
  });

  test('should display default tree structure', async ({ page }) => {
    // Check root node
    await expect(page.locator('.tree-root .tree-node-name')).toContainText('my-project/');
    
    // Check default nodes are present
    await expect(page.locator('.tree-node').filter({ hasText: 'src/' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'package.json' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'README.md' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'tsconfig.json' })).toBeVisible();
    
    // Check nested structure
    await expect(page.locator('.tree-node').filter({ hasText: 'components/' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'App.tsx' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'Header.tsx' })).toBeVisible();
  });

  test('should add new file to root', async ({ page }) => {
    // Click add button on root
    await page.locator('.tree-root .btn-icon[title="Add child"]').click();
    
    // Modal should appear
    await expect(page.locator('#add-node-modal')).toBeVisible();
    await expect(page.locator('.modal-header h3')).toHaveText('Add New Node');
    
    // Fill in file details
    await page.locator('#node-name-input').fill('newfile.txt');
    await page.locator('#node-type-select').selectOption('file');
    await expect(page.locator('#parent-select')).toHaveValue('root');
    
    // Confirm addition
    await page.locator('#confirm-add').click();
    
    // Modal should close
    await expect(page.locator('#add-node-modal')).toBeHidden();
    
    // New file should appear in tree
    await expect(page.locator('.tree-node').filter({ hasText: 'newfile.txt' })).toBeVisible();
    
    // Success notification should appear
    await expect(page.locator('.notification-success')).toBeVisible();
    await expect(page.locator('.notification-success')).toContainText('file "newfile.txt" added!');
  });

  test('should add new directory to root', async ({ page }) => {
    // Click add button on root
    await page.locator('.tree-root .btn-icon[title="Add child"]').click();
    
    // Fill in directory details
    await page.locator('#node-name-input').fill('docs');
    await page.locator('#node-type-select').selectOption('directory');
    
    // Confirm addition
    await page.locator('#confirm-add').click();
    
    // New directory should appear in tree with folder icon and slash
    const newDir = page.locator('.tree-node').filter({ hasText: 'docs/' });
    await expect(newDir).toBeVisible();
    await expect(newDir.locator('.fa-folder')).toBeVisible();
    
    // Should have add button for adding children
    await expect(newDir.locator('.btn-icon[title="Add child"]')).toBeVisible();
  });

  test('should add nested file to existing directory', async ({ page }) => {
    // Click add button on src directory
    const srcDir = page.locator('.tree-node').filter({ hasText: 'src/' });
    await srcDir.hover();
    await srcDir.locator('.btn-icon[title="Add child"]').click();
    
    // Fill in file details
    await page.locator('#node-name-input').fill('config.ts');
    await page.locator('#node-type-select').selectOption('file');
    
    // Parent should be pre-selected as src
    const parentSelect = page.locator('#parent-select');
    await expect(parentSelect.locator('option:checked')).toContainText('src/');
    
    // Confirm addition
    await page.locator('#confirm-add').click();
    
    // New file should appear under src directory
    await expect(page.locator('.tree-node').filter({ hasText: 'config.ts' })).toBeVisible();
  });

  test('should rename file inline', async ({ page }) => {
    // Find a file node and click on its name
    const fileNode = page.locator('.tree-node').filter({ hasText: 'README.md' });
    const fileName = fileNode.locator('.tree-node-name');
    
    // Click to edit
    await fileName.click();
    
    // Clear and type new name
    await fileName.fill('CHANGELOG.md');
    
    // Press Enter or blur to confirm
    await fileName.blur();
    
    // File should be renamed
    await expect(page.locator('.tree-node').filter({ hasText: 'CHANGELOG.md' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'README.md' })).not.toBeVisible();
    
    // Success notification should appear
    await expect(page.locator('.notification-success')).toContainText('Node renamed');
  });

  test('should rename directory inline', async ({ page }) => {
    // Find a directory node and click on its name
    const dirNode = page.locator('.tree-node').filter({ hasText: 'components/' });
    const dirName = dirNode.locator('.tree-node-name');
    
    // Click to edit
    await dirName.click();
    
    // Clear and type new name (without slash)
    await dirName.fill('widgets');
    
    // Blur to confirm
    await dirName.blur();
    
    // Directory should be renamed
    await expect(page.locator('.tree-node').filter({ hasText: 'widgets/' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'components/' })).not.toBeVisible();
  });

  test('should delete file with confirmation', async ({ page }) => {
    // Find a file and hover to show actions
    const fileNode = page.locator('.tree-node').filter({ hasText: 'tsconfig.json' });
    await fileNode.hover();
    
    // Set up dialog handler
    page.on('dialog', dialog => {
      expect(dialog.message()).toContain('Are you sure you want to delete this node?');
      dialog.accept();
    });
    
    // Click delete button
    await fileNode.locator('.btn-icon[title="Delete"]').click();
    
    // File should be removed
    await expect(page.locator('.tree-node').filter({ hasText: 'tsconfig.json' })).not.toBeVisible();
    
    // Info notification should appear
    await expect(page.locator('.notification')).toContainText('Node deleted');
  });

  test('should delete directory with all children', async ({ page }) => {
    // Find a directory with children
    const dirNode = page.locator('.tree-node').filter({ hasText: 'components/' });
    await dirNode.hover();
    
    // Set up dialog handler
    page.on('dialog', dialog => {
      dialog.accept();
    });
    
    // Click delete button
    await dirNode.locator('.btn-icon[title="Delete"]').click();
    
    // Directory and its children should be removed
    await expect(page.locator('.tree-node').filter({ hasText: 'components/' })).not.toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'App.tsx' })).not.toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'Header.tsx' })).not.toBeVisible();
  });

  test('should cancel delete operation', async ({ page }) => {
    const fileNode = page.locator('.tree-node').filter({ hasText: 'package.json' });
    await fileNode.hover();
    
    // Set up dialog handler to cancel
    page.on('dialog', dialog => {
      dialog.dismiss();
    });
    
    // Click delete button
    await fileNode.locator('.btn-icon[title="Delete"]').click();
    
    // File should still be present
    await expect(page.locator('.tree-node').filter({ hasText: 'package.json' })).toBeVisible();
  });

  test('should show and hide node actions on hover', async ({ page }) => {
    const fileNode = page.locator('.tree-node').filter({ hasText: 'package.json' });
    const actions = fileNode.locator('.tree-node-actions');
    
    // Actions should be hidden initially
    await expect(actions).toHaveCSS('opacity', '0');
    
    // Actions should appear on hover
    await fileNode.hover();
    await expect(actions).toHaveCSS('opacity', '1');
    
    // Actions should hide when not hovering
    await page.locator('.sidebar').hover();
    await expect(actions).toHaveCSS('opacity', '0');
  });

  test('should handle empty node name validation', async ({ page }) => {
    // Click add button
    await page.locator('.tree-root .btn-icon[title="Add child"]').click();
    
    // Try to add without name
    await page.locator('#confirm-add').click();
    
    // Error notification should appear
    await expect(page.locator('.notification-error')).toBeVisible();
    await expect(page.locator('.notification-error')).toContainText('Please enter a node name');
    
    // Modal should still be open
    await expect(page.locator('#add-node-modal')).toBeVisible();
  });

  test('should cancel add node operation', async ({ page }) => {
    // Click add button
    await page.locator('.tree-root .btn-icon[title="Add child"]').click();
    
    // Fill in some data
    await page.locator('#node-name-input').fill('test.txt');
    
    // Cancel
    await page.locator('#cancel-add').click();
    
    // Modal should close
    await expect(page.locator('#add-node-modal')).toBeHidden();
    
    // Node should not be added
    await expect(page.locator('.tree-node').filter({ hasText: 'test.txt' })).not.toBeVisible();
  });

  test('should close modal by clicking outside', async ({ page }) => {
    // Click add button
    await page.locator('.tree-root .btn-icon[title="Add child"]').click();
    
    // Click outside modal
    await page.locator('#add-node-modal').click();
    
    // Modal should close
    await expect(page.locator('#add-node-modal')).toBeHidden();
  });

  test('should close modal with X button', async ({ page }) => {
    // Click add button
    await page.locator('.tree-root .btn-icon[title="Add child"]').click();
    
    // Click X button
    await page.locator('.modal-close').click();
    
    // Modal should close
    await expect(page.locator('#add-node-modal')).toBeHidden();
  });

  test('should update parent select when adding directories', async ({ page }) => {
    // Add a new directory first
    await page.locator('.tree-root .btn-icon[title="Add child"]').click();
    await page.locator('#node-name-input').fill('newdir');
    await page.locator('#node-type-select').selectOption('directory');
    await page.locator('#confirm-add').click();
    
    // Open add modal again
    await page.locator('.tree-root .btn-icon[title="Add child"]').click();
    
    // Check that new directory appears in parent select
    const parentSelect = page.locator('#parent-select');
    await expect(parentSelect.locator('option').filter({ hasText: 'newdir/' })).toBeVisible();
  });
}); 