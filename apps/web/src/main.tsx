import React from 'react';
import ReactDOM from 'react-dom/client';
import { SeedStoreIntegrationDemo } from './components/demo/SeedStoreIntegrationDemo';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="max-w-2xl mx-auto min-h-screen bg-white text-slate-900 shadow-xl">
      <SeedStoreIntegrationDemo />
    </div>
  </React.StrictMode>
);
