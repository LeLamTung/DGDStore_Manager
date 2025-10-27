import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import routes, { renderRoutes } from './routes';

const App = () => {
  const baseName = import.meta.env.VITE_APP_BASE_NAME || '/';
  
  return (
    <BrowserRouter basename={baseName.startsWith('/') ? baseName : `/${baseName}`}>
      {renderRoutes(routes)}
    </BrowserRouter>
  );
};

export default App;
