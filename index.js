/**
 * react-blessed
 * ==============
 *
 * Exposing the renderer's API.
 */
import ReactInstanceHandles from 'react/lib/ReactInstanceHandles';
import ReactElement from 'react/lib/ReactElement';
import ReactUpdates from 'react/lib/ReactUpdates';
import ReactBlessedIDOperations from './src/ReactBlessedIDOperations';
import invariant from 'react/lib/invariant';
import instantiateReactComponent from 'react/lib/instantiateReactComponent';
import inject from './src/ReactBlessedInjection';
import blessed from 'blessed';

// Injecting dependencies
inject();

function render(element, opts={}) {

  // Is the given element valid?
  invariant(
    ReactElement.isValidElement(element),
    'render(): You must pass a valid ReactElement.'
  );

  // Creating a root id
  const id = ReactInstanceHandles.createReactRootID();

  // Creating our screen
  const screen = blessed.screen(opts);

  // DEBUG: escaping the screen
  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });

  // Mounting the app
  const transaction = ReactUpdates.ReactReconcileTransaction.getPooled(),
        component = instantiateReactComponent(element);

  // Injecting the screen
  ReactBlessedIDOperations.setScreen(screen);

  transaction.perform(() => {
    component.mountComponent(id, transaction, {});
  });

  // Returning the screen so the user can handle it properly
  return screen;
}

export {render};
