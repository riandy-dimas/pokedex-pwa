import { Suspense } from 'react';
import { BrowserRouter, Route, Routes as ReactRoutes } from 'react-router-dom';
import LoadingPage from './components/utility/PageLoader';

import Home from './pages/Home';
import Detail from './pages/Detail';
import Error from './pages/Error';

const Routes = () => {
  return (
    <BrowserRouter>
      <ReactRoutes>
        <Route
          path="/"
          element={<Suspense fallback={LoadingPage}>
            <Home />
          </Suspense>} />
        <Route
          path="/:pokemonName"
          element={<Suspense fallback={LoadingPage}>
            <Detail />
          </Suspense>} />
        <Route path="*" element={<Error />} />
      </ReactRoutes>
    </BrowserRouter>
  );
};

export default Routes;
