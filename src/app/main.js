import './styles.css';
import '../styles/render.css';
import { createFractionFlowApp } from './app.js';

const root = document.querySelector('#app');
if (!root) throw new Error('FractionFlow app root is missing');

createFractionFlowApp({ root }).mount();
