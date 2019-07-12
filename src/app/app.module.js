import {AppComponent} from './app.component';

export const App = {
  init () {
    this.initComponents ();
    this.initServiceWorker ();
  },

  initComponents () {
    AppComponent.init ();
  },

  initServiceWorker () {
    if (!navigator.serviceWorker) {
      return;
    }
    navigator.serviceWorker
      .register ('./sw.js')
      .then (() => {
        console.log ('sw registered suceessfully!');
      })
      .catch (e => {
        console.error ('Some error while registering sw', e);
      });
  },
};
