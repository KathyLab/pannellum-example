import EasyPannellum from './components/EasyPannellum.vue'

/* istanbul ignore next */
EasyPannellum.install = function (app) {
  app.component(EasyPannellum.name, EasyPannellum)
}

export default EasyPannellum