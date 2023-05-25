import { dispatch } from "../../store";
import { navigate } from "../../store/action";
import { Screens } from "../../types/navigation";
import firebase from "../../utils/firebase";


const credentials = {email: "", password: ""};

export default class Login extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode: "open"})
    }

    connectedCallback() {
        this.render()
    }

    async handleLoginButton(){
        firebase.loginUser(credentials);
        dispatch(navigate(Screens.DASHBOARD))
    }

    render() {
       const title = this.ownerDocument.createElement('h1')
       title.innerText = "Welcome! Sign In"
       this.shadowRoot?.appendChild(title)

       const emailInp = this.ownerDocument.createElement('input');
       emailInp.placeholder = "email"
       emailInp.type = "email"
       emailInp.addEventListener(
        "change", (e: any) => (credentials.email = e.target.value)
       )
       this.shadowRoot?.appendChild(emailInp)

       const password = this.ownerDocument.createElement('input');
       password.placeholder = "******";
       password.type = "password";
       password.addEventListener("change", 
       (e:any) => {credentials.password = e.target.value})
       this.shadowRoot?.appendChild(password)

       const logBtn = this.ownerDocument.createElement('button');
       logBtn.innerText = "Log in";
       logBtn.addEventListener("click", this.handleLoginButton)
       this.shadowRoot?.appendChild(logBtn)
    }
}
customElements.define("app-login", Login)