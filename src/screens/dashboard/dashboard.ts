import { addObserver, appState, dispatch } from "../../store";
import { navigate, setUserCredentials } from "../../store/action";
import { Screens } from "../../types/navigation";
import { Product } from "../../types/products";
import firebase from "../../utils/firebase";

const formData: Omit<Product, "id"> = {
    name: "",
    price: 0,
    createdAt: ""
}

export default class Dashboard extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode: "open"})
        addObserver(this);
    }

    connectedCallback() {
        this.render()
    }

    validateLogin(){
        console.log('hello',appState.user);
        if(appState.user !== ''){
            console.log(formData);
            firebase.addProduct(formData);
        }else{
            console.error('Pls log in')
            dispatch(navigate(Screens.SIGNUP))
        }
    }

    logOutUser(){
        if(appState.user !== null || ''){
            dispatch(setUserCredentials(''))
        }
    }

    changeName(e:any){
        formData.name = e?.target?.value;;
    }

    changePrice(e:any){
        formData.price = Number(e.target.value)
    }

    async render() {
       const welcome = this.ownerDocument.createElement('h1')
       welcome.innerText = "Welcome" + appState.user
       this.shadowRoot?.appendChild(welcome)

       const logOutBtn = this.ownerDocument.createElement('button');
       logOutBtn.innerText = "Log Out"
       logOutBtn.className = "BtnLogOut"
       logOutBtn.addEventListener("click", this.logOutUser)
       this.shadowRoot?.appendChild(logOutBtn)

       const title = this.ownerDocument.createElement('h2');
       title.innerText = "Add a product";
       this.shadowRoot?.appendChild(title)

       const pName = this.ownerDocument.createElement('input');
       pName.placeholder = "Product name";
       pName.addEventListener('change', this.changeName);
       this.shadowRoot?.appendChild(pName)

       const pPrice = this.ownerDocument.createElement('input');
       pPrice.placeholder = "Product price";
       pPrice.addEventListener('change', this.changePrice);
       this.shadowRoot?.appendChild(pPrice)

       const save = this.ownerDocument.createElement('button');
       save.innerText = "New post"
       save.className = "BtnNewPost"
       save.addEventListener("click", this.validateLogin)
       this.shadowRoot?.appendChild(save);

       const productList = this.ownerDocument.createElement("section");
       this.shadowRoot?.appendChild(productList)


       firebase.getProductsListener((products)=>{
        const oldOnesIds: String[] = [];
        productList.childNodes.forEach((i)=>{
            if(i instanceof HTMLElement) oldOnesIds.push(i.dataset.pid || "");
        });
        const newOnes = products.filter((prod)=> !oldOnesIds.includes(prod.id))
        console.log(newOnes)

        newOnes.forEach((p:Product) => {
            const container = this.ownerDocument.createElement('section');
            container.className = "containerPost"
            container.setAttribute("data-pid", p.id);

            const name = this.ownerDocument.createElement('h3')
            name.className = "namePost";
            name.innerText = p.name;

            const createdAt = this.ownerDocument.createElement('h3');
            createdAt.className = "createdAtPost";
            createdAt.innerText = String(new Date(Number(p.createdAt)*1000));
            container.appendChild(createdAt);

            const price = this.ownerDocument.createElement('h3');
            price.className = "pricePost";
            price.innerText = String(p.price);
            container.appendChild(price);

            productList.prepend(container)


        })
       })
    }
}
customElements.define("app-dashboard", Dashboard)