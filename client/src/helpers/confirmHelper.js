import {Subject} from "rxjs";

class ConfirmHelper {

    confirmSubject = new Subject();

    constructor(){
        if(! ConfirmHelper.instance){
            ConfirmHelper.instance = this;
        }

        return ConfirmHelper.instance;
    }

    confirm(text, callback) {
        this.confirmSubject.next({ text, callback });
    }
}

export default new ConfirmHelper();
