import {appTemplate} from './app.template';
import {appModel} from './app.model';

export const AppComponent = {
  init () {
    this.appElement = document.querySelector ('#app');
    this.render ();
    this.initEvents ();
  },

  initEvents () {
    this.appElement.addEventListener ('click', function (event) {
      if (event.target.className === 'btn-todo') {
        import (/* webpackChunkName: "todo" */ './todo/todo.module')
          .then (lazyModule => {
            lazyModule.TodoModule.init ();
          })
          .catch (e => `An error occured while loading module.`);
      }
    });

    document.querySelector ('.banner').addEventListener ('click', event => {
      event.preventDefault ();
      this.render ();
    });
  },

  render () {
    this.appElement.innerHTML = appTemplate (appModel);
  },
};
