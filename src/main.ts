import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';;
import "primevue/resources/primevue.min.css"; // core css
import 'primevue/resources/themes/lara-light-green/theme.css'
import "/node_modules/primeflex/primeflex.css"
import 'primeicons/primeicons.css'
const app = createApp(App);
app.use(PrimeVue);

import Card from 'primevue/card';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import InputSwitch from 'primevue/inputswitch';
import InputNumber from 'primevue/inputnumber';
import FileUpload from 'primevue/fileupload';

app.component('Button', Button);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Card', Card);
app.component('InputText', InputText);
app.component('InputSwitch', InputSwitch);
app.component('InputNumber', InputNumber);
app.component('FileUpload', FileUpload);

app.mount('#app')

window.addEventListener("keydown", function (e) {
     if ((e.key === "F5") || (e.ctrlKey && e.key === "r")) {
       e.preventDefault();
       alert("Le rafraîchissement est désactivé !");
     }
   });
   
   // Bloquer le clic droit → recharger dans certains contextes
   window.addEventListener("contextmenu", function (e) {
     e.preventDefault();
   });
   
   // Empêcher navigation en arrière/avant
   history.pushState(null, "", window.location.href);
   window.onpopstate = function () {
     history.go(1);
   };

   window.addEventListener("beforeunload", function (e) {
     e.preventDefault();
     e.returnValue = "Si tu rafraichis la page, je te mets 0.";
   });