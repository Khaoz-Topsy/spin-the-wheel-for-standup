import 'reflect-metadata';

import { render } from 'solid-js/web';
import { ComponentProps } from 'solid-js';

import { AppShell } from './appShell';

import 'animate.css';
import './scss/custom.scss';

declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      ['emoji-picker']: ComponentProps<'div'>;
    }
  }
}

render(() => <AppShell />, document.getElementById('spinner') as HTMLElement);
