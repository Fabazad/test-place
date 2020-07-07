class IdHelper {

    lastId = 0;

    constructor(){
        if(! IdHelper.instance){
            IdHelper.instance = this;
        }

        return IdHelper.instance;
    }

    newId(prefix='id') {
        this.lastId++;
        return `${prefix}${this.lastId}`;
    }
}

export default new IdHelper();