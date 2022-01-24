import { Suspense } from 'react';
import { BrowserRouter, Route, Routes as ReactRoutes } from 'react-router-dom';
import Loading from './components/Loading';

import Home from './pages/Home';
import Detail from './pages/Detail';
import Error from './pages/Error';

const Routes = () => {
  return (
    <BrowserRouter>
      <ReactRoutes>
        <Route
          path="/"
          element={<Suspense fallback={Loading}>
            <Home />
          </Suspense>} />
        <Route
          path="/:pokemonName"
          element={<Suspense fallback={Loading}>
            <Detail />
          </Suspense>} />
        <Route path="*" element={<Error />} />
      </ReactRoutes>
    </BrowserRouter>
  );
};

export default Routes;
