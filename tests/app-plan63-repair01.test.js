import { describe,it,expect } from 'vitest';
import { createFractionFlowApp } from '../src/app/app.js';
import { setupMockDOM,teardownMockDOM } from './fixtures/mock-dom.js';

describe('comparison same-app remount',()=>{
 it('renders a fresh response after remount and ignores a detached old response control',()=>{
  const document=setupMockDOM();const root=document.createElement('div');document.body.appendChild(root);
  const app=createFractionFlowApp({root,presentationMode:'instant-test'}).mount();
  openChooser(root); root.querySelector('[data-practice-type="symbolic-fraction-comparison"]').click();
  const oldCheck=root.querySelector('.app-visual-view [data-plan45-focus-key="check"]');expect(oldCheck).toBeTruthy();
  app.destroy();app.mount();openChooser(root); root.querySelector('[data-practice-type="symbolic-fraction-comparison"]').click();
  expect(root.querySelector('.app-visual-view [data-plan45-focus-key="check"]')).toBeTruthy();oldCheck.click();expect(app.getState().status).toBe('active');
  app.dispatch({type:'submit-fraction-comparison',proposed:'>'});expect(app.getState().status).toBe('resolved');app.destroy();teardownMockDOM();
 });
});

function openChooser(root) {
  const chooser = root.querySelector('[data-entry-chooser]');
  if (chooser.getAttribute('aria-expanded') === 'false') chooser.click();
}
