import { reactive, watch } from "vue";

//initialize isLoggedIn from localStorage or default to false
const isLoggedInFromStorage = localStorage.getItem('isLoggedIn') === 'true';

export const state = reactive({
    isLoggedIn: isLoggedInFromStorage,
})

//watcher for isLoggedIn
watch(() => state.isLoggedIn, (newValue) => {
    localStorage.setItem('isLoggedIn', newValue.toString());
})
