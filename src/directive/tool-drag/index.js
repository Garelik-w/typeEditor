import toolDrag from './drag'

const install = function(Vue) {
  Vue.directive('v-tool-drag', toolDrag)
}

if (window.Vue) {
  window['v-tool-drag'] = toolDrag
  Vue.use(install); // eslint-disable-line
}

toolDrag.install = install
export default toolDrag
