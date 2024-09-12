import { type Component } from 'solid-js';

import { WheelPanel } from '../components/wheelPanel';

export const Home: Component = () => {
  return (
    <main class="home container">
      <WheelPanel />
    </main>
  );
};
