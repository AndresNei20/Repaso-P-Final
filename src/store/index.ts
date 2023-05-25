import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";
import { setUserCredentials } from "./action";
import { Screens } from "../types/navigation";
import { observer } from "../types/store";
import { reducer } from "./reducer";


onAuthStateChanged(auth,(user) => {
    console.log(user)
    if(user){
        user.email !== null ? dispatch(setUserCredentials(user.email)) : ''
    }
})

const emptyState = {
    screen: Screens.DASHBOARD,
    user: {}
};

export let appState: any = emptyState;

let observers: observer[] = [];

const notifyObservers = () => observers.forEach((o)=>o.render());

export const dispatch = (action:any) => {
    const clone = JSON.parse(JSON.stringify(appState));
    const newState = reducer(action, clone);
    appState = newState;
    notifyObservers();
};

export const addObserver = (ref: observer) => {
    observers = [...observers, ref];
}