import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

console.log("React App: Initializing... Page ID = smack-mails_page_email-customizer-add-new?");
console.log("React App: Root exists?", !!document.getElementById('root'));
console.log("React App: ClassicEditor exists?", !!(window as any).ClassicEditor);

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement as HTMLElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}


reportWebVitals();
