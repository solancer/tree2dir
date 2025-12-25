import { test, expect } from '@playwright/test';

test.describe('Project Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#loading-screen')).toBeHidden({ timeout: 10000 });
  });

  test('should display project information form', async ({ page }) => {
    // Check form elements are visible
    await expect(page.locator('#project-name')).toBeVisible();
    await expect(page.locator('#root-name')).toBeVisible();
    await expect(page.locator('#project-description')).toBeVisible();
    
    // Check labels
    await expect(page.locator('label').filter({ hasText: 'Project Name' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Root Directory' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Description' })).toBeVisible();
    
    // Check default values
    await expect(page.locator('#project-name')).toHaveValue('My Project');
    await expect(page.locator('#root-name')).toHaveValue('my-project');
    await expect(page.locator('#project-description')).toHaveValue('A sample project structure');
  });

  test('should update project name', async ({ page }) => {
    // Change project name
    await page.locator('#project-name').fill('Awesome Project');
    
    // Check preview updates
    const preview = page.locator('#preview-output');
    await expect(preview).toContainText('# Awesome Project');
    
    // Check tree root name doesn't change automatically
    await expect(page.locator('.tree-root .tree-node-name')).toContainText('my-project/');
  });

  test('should update root directory name', async ({ page }) => {
    // Change root name
    await page.locator('#root-name').fill('awesome-project');
    
    // Check tree root updates
    await expect(page.locator('.tree-root .tree-node-name')).toContainText('awesome-project/');
    
    // Check preview updates
    const preview = page.locator('#preview-output');
    await expect(preview).toContainText('awesome-project/');
    
    // Check parent select updates
    await page.locator('.tree-root .btn-icon[title="Add child"]').click();
    await expect(page.locator('#parent-select option').first()).toContainText('Root (awesome-project)');
    await page.locator('#cancel-add').click();
  });

  test('should update project description', async ({ page }) => {
    // Change description
    await page.locator('#project-description').fill('A comprehensive project with advanced features');
    
    // Check preview updates
    const preview = page.locator('#preview-output');
    await expect(preview).toContainText('# A comprehensive project with advanced features');
  });

  test('should create new project', async ({ page }) => {
    // Modify current project first
    await page.locator('#project-name').fill('Modified Project');
    await page.locator('.tree-root .btn-icon[title="Add child"]').click();
    await page.locator('#node-name-input').fill('test.txt');
    await page.locator('#confirm-add').click();
    
    // Click new button
    await page.locator('#new-btn').click();
    
    // Check project is reset to defaults
    await expect(page.locator('#project-name')).toHaveValue('New Project');
    await expect(page.locator('#root-name')).toHaveValue('new-project');
    await expect(page.locator('#project-description')).toHaveValue('A new project structure');
    
    // Check tree is empty
    await expect(page.locator('.tree-node')).toHaveCount(0);
    
    // Check root name updates
    await expect(page.locator('.tree-root .tree-node-name')).toContainText('new-project/');
    
    // Check success notification
    await expect(page.locator('.notification-success')).toContainText('New tree created!');
  });

  test('should validate project inputs', async ({ page }) => {
    // Test empty project name
    await page.locator('#project-name').fill('');
    const preview = page.locator('#preview-output');
    await expect(preview).toContainText('# ');
    
    // Test empty root name
    await page.locator('#root-name').fill('');
    await expect(page.locator('.tree-root .tree-node-name')).toContainText('/');
    
    // Test special characters in root name
    await page.locator('#root-name').fill('my project with spaces');
    await expect(page.locator('.tree-root .tree-node-name')).toContainText('my project with spaces/');
  });

  test('should handle long project names and descriptions', async ({ page }) => {
    const longName = 'A'.repeat(100);
    const longDescription = 'B'.repeat(500);
    
    // Set long values
    await page.locator('#project-name').fill(longName);
    await page.locator('#project-description').fill(longDescription);
    
    // Check values are preserved
    await expect(page.locator('#project-name')).toHaveValue(longName);
    await expect(page.locator('#project-description')).toHaveValue(longDescription);
    
    // Check preview handles long content
    const preview = page.locator('#preview-output');
    await expect(preview).toContainText(longName);
    await expect(preview).toContainText(longDescription);
  });

  test('should update all formats when project metadata changes', async ({ page }) => {
    // Change project metadata
    await page.locator('#project-name').fill('Updated Project');
    await page.locator('#root-name').fill('updated-root');
    await page.locator('#project-description').fill('Updated description');
    
    // Check tree format
    const preview = page.locator('#preview-output');
    await expect(preview).toContainText('# Updated Project');
    await expect(preview).toContainText('# Updated description');
    await expect(preview).toContainText('updated-root/');
    
    // Check JSON format
    await page.locator('[data-format="json"]').click();
    await expect(preview).toContainText('"name": "Updated Project"');
    await expect(preview).toContainText('"root": "updated-root"');
    await expect(preview).toContainText('"description": "Updated description"');
    
    // Check YAML format
    await page.locator('[data-format="yaml"]').click();
    await expect(preview).toContainText('name: "Updated Project"');
    await expect(preview).toContainText('root: "updated-root"');
    await expect(preview).toContainText('description: "Updated description"');
  });

  test('should preserve project metadata when switching templates', async ({ page }) => {
    // Set custom metadata
    await page.locator('#project-name').fill('Custom Project');
    await page.locator('#root-name').fill('custom-root');
    await page.locator('#project-description').fill('Custom description');
    
    // Load React template
    await page.locator('[data-template="react"]').click();
    
    // Check metadata is overridden by template
    await expect(page.locator('#project-name')).toHaveValue('React App');
    await expect(page.locator('#root-name')).toHaveValue('react-app');
    await expect(page.locator('#project-description')).toHaveValue('Modern React application');
  });

  test('should handle special characters in project metadata', async ({ page }) => {
    // Set metadata with special characters
    await page.locator('#project-name').fill('My "Special" Project & More <test>');
    await page.locator('#root-name').fill('special-project');
    await page.locator('#project-description').fill('Description with "quotes" & symbols <test>');
    
    // Check tree format handles special characters
    const preview = page.locator('#preview-output');
    await expect(preview).toContainText('# My "Special" Project & More <test>');
    await expect(preview).toContainText('# Description with "quotes" & symbols <test>');
    
    // Check JSON format escapes properly
    await page.locator('[data-format="json"]').click();
    await expect(preview).toContainText('"name": "My \\"Special\\" Project & More <test>"');
    
    // Check YAML format handles special characters
    await page.locator('[data-format="yaml"]').click();
    await expect(preview).toContainText('name: "My \\"Special\\" Project & More <test>"');
  });

  test('should update parent select when root name changes', async ({ page }) => {
    // Change root name
    await page.locator('#root-name').fill('new-root');
    
    // Open add node modal
    await page.locator('.tree-root .btn-icon[title="Add child"]').click();
    
    // Check parent select shows new root name
    const parentSelect = page.locator('#parent-select');
    await expect(parentSelect.locator('option').first()).toContainText('Root (new-root)');
    
    // Close modal
    await page.locator('#cancel-add').click();
  });

  test('should maintain form state during tree operations', async ({ page }) => {
    // Set custom metadata
    await page.locator('#project-name').fill('Test Project');
    await page.locator('#root-name').fill('test-project');
    await page.locator('#project-description').fill('Test description');
    
    // Add a node
    await page.locator('.tree-root .btn-icon[title="Add child"]').click();
    await page.locator('#node-name-input').fill('test.txt');
    await page.locator('#confirm-add').click();
    
    // Check metadata is preserved
    await expect(page.locator('#project-name')).toHaveValue('Test Project');
    await expect(page.locator('#root-name')).toHaveValue('test-project');
    await expect(page.locator('#project-description')).toHaveValue('Test description');
    
    // Delete a node
    const fileNode = page.locator('.tree-node').filter({ hasText: 'test.txt' });
    await fileNode.hover();
    page.on('dialog', dialog => dialog.accept());
    await fileNode.locator('.btn-icon[title="Delete"]').click();
    
    // Check metadata is still preserved
    await expect(page.locator('#project-name')).toHaveValue('Test Project');
    await expect(page.locator('#root-name')).toHaveValue('test-project');
    await expect(page.locator('#project-description')).toHaveValue('Test description');
  });

  test('should handle textarea resize and multiline descriptions', async ({ page }) => {
    const multilineDescription = `This is a multiline description
with multiple lines
and various content
including special characters: !@#$%^&*()`;
    
    // Set multiline description
    await page.locator('#project-description').fill(multilineDescription);
    
    // Check value is preserved
    await expect(page.locator('#project-description')).toHaveValue(multilineDescription);
    
    // Check preview shows multiline content
    const preview = page.locator('#preview-output');
    await expect(preview).toContainText('This is a multiline description');
    await expect(preview).toContainText('with multiple lines');
  });

  test('should show project info section header', async ({ page }) => {
    // Check section header
    await expect(page.locator('.sidebar-section h3').first()).toContainText('Project Info');
    
    // Check section is properly styled
    const section = page.locator('.sidebar-section').first();
    await expect(section).toBeVisible();
    await expect(section.locator('h3')).toBeVisible();
  });
}); 