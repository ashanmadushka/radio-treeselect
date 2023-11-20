import RadioTreeSelect from "./components/RadioTreeSelect.vue";
import Treeselect from "vue3-treeselect";

function install(Vue) {
	if (install.installed) return;
	install.installed = true;
    Treeselect.setup();
	Vue.component("radio-treeselect", RadioTreeSelect);
}

const plugin = {
	install,
};

let GlobalVue = null;
if (typeof window !== "undefined") {
	GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
	GlobalVue = global.vue;
}
if (GlobalVue) {
	GlobalVue.use(plugin);
}

RadioTreeSelect.install = install;

export default RadioTreeSelect;

