import { Route, Router } from '@solidjs/router';
import { type Component } from 'solid-js';

import { Home } from './pages/home';

export const AppShell: Component = () => {
  return (
    <Router>
      <Route path="/" component={Home} />
    </Router>
  );
};
