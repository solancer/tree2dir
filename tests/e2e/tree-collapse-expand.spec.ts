import { test, expect } from '@playwright/test';

test.describe('Tree Collapse/Expand Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#loading-screen')).toBeHidden({ timeout: 10000 });
  });

  test('should display toggle buttons for directories with children', async ({ page }) => {
    // Check root has toggle button
    await expect(page.locator('.tree-root > .tree-node-content .tree-toggle')).toBeVisible();
    await expect(page.locator('.tree-root > .tree-node-content .tree-toggle i.fa-chevron-down')).toBeVisible();
    
    // Check src directory has toggle button - using node ID to uniquely identify the toggle
    const srcNode = page.locator('.tree-node').filter({ hasText: 'src/' }).first();
    const srcToggle = srcNode.locator('button.tree-toggle[onclick*="toggleNode"]').first();
    await expect(srcToggle).toBeVisible();
    await expect(srcToggle.locator('i.fa-chevron-down')).toBeVisible();
    
    // Check components directory has toggle button
    const componentsNode = page.locator('.tree-node').filter({ hasText: 'components/' }).first();
    const componentsToggle = componentsNode.locator('button.tree-toggle[onclick*="toggleNode"]').first();
    await expect(componentsToggle).toBeVisible();
    await expect(componentsToggle.locator('i.fa-chevron-down')).toBeVisible();
  });

  test('should not display toggle buttons for files', async ({ page }) => {
    // Check files don't have toggle buttons, but have spacers
    const fileNode = page.locator('.tree-node').filter({ hasText: 'package.json' });
    await expect(fileNode.locator('.tree-toggle')).not.toBeVisible();
    await expect(fileNode.locator('.tree-spacer')).toBeVisible();
    
    const readmeNode = page.locator('.tree-node').filter({ hasText: 'README.md' });
    await expect(readmeNode.locator('.tree-toggle')).not.toBeVisible();
    await expect(readmeNode.locator('.tree-spacer')).toBeVisible();
  });

  test('should not display toggle buttons for empty directories', async ({ page }) => {
    // Add an empty directory first
    await page.locator('.tree-root > .tree-node-content .btn-icon[title="Add child"]').click();
    await page.locator('#node-name-input').fill('empty-dir');
    await page.locator('#node-type-select').selectOption('directory');
    await page.locator('#confirm-add').click();
    
    // Check empty directory doesn't have toggle button
    const emptyDirNode = page.locator('.tree-node').filter({ hasText: 'empty-dir/' });
    await expect(emptyDirNode.locator('.tree-toggle')).not.toBeVisible();
    await expect(emptyDirNode.locator('.tree-spacer')).toBeVisible();
  });

  test('should collapse root directory when toggle is clicked', async ({ page }) => {
    // Initially, children should be visible
    await expect(page.locator('.tree-node').filter({ hasText: 'src/' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'package.json' })).toBeVisible();
    
    // Click root toggle button
    await page.locator('.tree-root > .tree-node-content .tree-toggle').click();
    
    // Check icon changed to right arrow
    await expect(page.locator('.tree-root > .tree-node-content .tree-toggle i.fa-chevron-right')).toBeVisible();
    
    // Check children are hidden
    await expect(page.locator('.tree-root .tree-children')).toHaveClass(/collapsed/);
    
    // Children should not be visible (but may still exist in DOM)
    const srcNode = page.locator('.tree-node').filter({ hasText: 'src/' });
    await expect(srcNode).not.toBeVisible();
  });

  test('should expand root directory when toggle is clicked again', async ({ page }) => {
    // First collapse
    await page.locator('.tree-root > .tree-node-content .tree-toggle').click();
    await expect(page.locator('.tree-root > .tree-node-content .tree-toggle i.fa-chevron-right')).toBeVisible();
    
    // Then expand
    await page.locator('.tree-root > .tree-node-content .tree-toggle').click();
    
    // Check icon changed back to down arrow
    await expect(page.locator('.tree-root > .tree-node-content .tree-toggle i.fa-chevron-down')).toBeVisible();
    
    // Check children are visible again
    await expect(page.locator('.tree-root .tree-children')).not.toHaveClass(/collapsed/);
    await expect(page.locator('.tree-node').filter({ hasText: 'src/' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'package.json' })).toBeVisible();
  });

  test('should collapse nested directory independently', async ({ page }) => {
    // Initially, src children should be visible
    await expect(page.locator('.tree-node').filter({ hasText: 'components/' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'utils/' })).toBeVisible();
    
    // Click src directory toggle
    const srcNode = page.locator('.tree-node').filter({ hasText: 'src/' });
    await srcNode.locator('.tree-toggle').click();
    
    // Check src icon changed to right arrow
    await expect(srcNode.locator('.tree-toggle i.fa-chevron-right')).toBeVisible();
    
    // Check src children are hidden
    await expect(page.locator('.tree-node').filter({ hasText: 'components/' })).not.toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'utils/' })).not.toBeVisible();
    
    // But root level files should still be visible
    await expect(page.locator('.tree-node').filter({ hasText: 'package.json' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'README.md' })).toBeVisible();
  });

  test('should collapse deeply nested directories', async ({ page }) => {
    // Initially, components children should be visible
    await expect(page.locator('.tree-node').filter({ hasText: 'App.tsx' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'Header.tsx' })).toBeVisible();
    
    // Click components directory toggle
    const componentsNode = page.locator('.tree-node').filter({ hasText: 'components/' });
    await componentsNode.locator('.tree-toggle').click();
    
    // Check components icon changed to right arrow
    await expect(componentsNode.locator('.tree-toggle i.fa-chevron-right')).toBeVisible();
    
    // Check components children are hidden
    await expect(page.locator('.tree-node').filter({ hasText: 'App.tsx' })).not.toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'Header.tsx' })).not.toBeVisible();
    
    // But src directory and its other children should still be visible
    await expect(page.locator('.tree-node').filter({ hasText: 'src/' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'utils/' })).toBeVisible();
  });

  test('should maintain collapse state when adding new nodes', async ({ page }) => {
    // Collapse src directory
    const srcNode = page.locator('.tree-node').filter({ hasText: 'src/' });
    await srcNode.locator('.tree-toggle').click();
    await expect(srcNode.locator('.tree-toggle i.fa-chevron-right')).toBeVisible();
    
    // Add a new file to root
    await page.locator('.tree-root > .tree-node-content .btn-icon[title="Add child"]').click();
    await page.locator('#node-name-input').fill('newfile.txt');
    await page.locator('#node-type-select').selectOption('file');
    await page.locator('#confirm-add').click();
    
    // Check src directory is still collapsed
    await expect(srcNode.locator('.tree-toggle i.fa-chevron-right')).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'components/' })).not.toBeVisible();
    
    // But new file should be visible
    await expect(page.locator('.tree-node').filter({ hasText: 'newfile.txt' })).toBeVisible();
  });

  test('should reset collapse state when loading templates', async ({ page }) => {
    // Collapse some directories
    await page.locator('.tree-root > .tree-node-content .tree-toggle').click();
    const srcNode = page.locator('.tree-node').filter({ hasText: 'src/' });
    await srcNode.locator('.tree-toggle').click();
    
    // Load React template
    await page.locator('[data-template="react"]').click();
    
    // Check all directories are expanded in the new template
    await expect(page.locator('.tree-root > .tree-node-content .tree-toggle i.fa-chevron-down')).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'src/' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'components/' })).toBeVisible();
    await expect(page.locator('.tree-node').filter({ hasText: 'public/' })).toBeVisible();
  });

  test('should reset collapse state when creating new tree', async ({ page }) => {
    // Collapse root directory
    await page.locator('.tree-root > .tree-node-content .tree-toggle').click();
    await expect(page.locator('.tree-root > .tree-node-content .tree-toggle i.fa-chevron-right')).toBeVisible();
    
    // Create new tree
    await page.locator('#new-btn').click();
    
    // Check root is expanded in new tree
    await expect(page.locator('.tree-root > .tree-node-content .tree-toggle i.fa-chevron-down')).toBeVisible();
    await expect(page.locator('.tree-root .tree-children')).not.toHaveClass(/collapsed/);
  });

  test('should handle toggle button hover effects', async ({ page }) => {
    const rootToggle = page.locator('.tree-root > .tree-node-content .tree-toggle');
    
    // Check initial state
    await expect(rootToggle).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)'); // transparent
    
    // Hover should change appearance
    await rootToggle.hover();
    // Note: Exact color values may vary, so we just check that it's not transparent
    const hoverBg = await rootToggle.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(hoverBg).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('should work with keyboard navigation', async ({ page }) => {
    // Focus on root toggle button
    await page.locator('.tree-root > .tree-node-content .tree-toggle').focus();
    
    // Press Enter to toggle
    await page.keyboard.press('Enter');
    
    // Check directory collapsed
    await expect(page.locator('.tree-root > .tree-node-content .tree-toggle i.fa-chevron-right')).toBeVisible();
    
    // Press Enter again to expand
    await page.keyboard.press('Enter');
    
    // Check directory expanded
    await expect(page.locator('.tree-root > .tree-node-content .tree-toggle i.fa-chevron-down')).toBeVisible();
  });

  test('should maintain proper indentation when collapsed', async ({ page }) => {
    // Check initial indentation structure
    const srcNode = page.locator('.tree-node').filter({ hasText: 'src/' });
    const componentsNode = page.locator('.tree-node').filter({ hasText: 'components/' });
    
    // Get initial positions
    const srcBox = await srcNode.boundingBox();
    const componentsBox = await componentsNode.boundingBox();
    
    expect(componentsBox!.x).toBeGreaterThan(srcBox!.x); // components should be indented more
    
    // Collapse and expand src
    await srcNode.locator('.tree-toggle').click();
    await srcNode.locator('.tree-toggle').click();
    
    // Check indentation is preserved
    const newComponentsBox = await componentsNode.boundingBox();
    expect(newComponentsBox!.x).toBeGreaterThan(srcBox!.x);
  });

  test('should show correct toggle icons for all directory states', async ({ page }) => {
    // Test various directory states
    const directories = [
      { selector: '.tree-root', name: 'root' },
      { selector: '.tree-node:has-text("src/")', name: 'src' },
      { selector: '.tree-node:has-text("components/")', name: 'components' },
      { selector: '.tree-node:has-text("utils/")', name: 'utils' }
    ];
    
    for (const dir of directories) {
      const dirNode = page.locator(dir.selector);
      const toggle = dirNode.locator('.tree-toggle');
      
      // Initially expanded (down arrow)
      await expect(toggle.locator('i.fa-chevron-down')).toBeVisible();
      
      // Click to collapse (right arrow)
      await toggle.click();
      await expect(toggle.locator('i.fa-chevron-right')).toBeVisible();
      
      // Click to expand again (down arrow)
      await toggle.click();
      await expect(toggle.locator('i.fa-chevron-down')).toBeVisible();
    }
  });
}); 