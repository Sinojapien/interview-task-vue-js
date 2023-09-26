import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faTrash, faAngleLeft, faAngleRight, faMapMarker } from "@fortawesome/free-solid-svg-icons";

library.add(faTrash);
library.add(faAngleLeft);
library.add(faAngleRight);
library.add(faMapMarker);

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);

app.use(createPinia());

app.mount("#app");
