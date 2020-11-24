let Entity = require("entitystorage")
class Element extends Entity{
    
    initNew(type, name){
        this.type = type;
        this.name = name;
        this.tag("element")
    }

    static async init(){
        await Entity.init("./data");
    }

    static lookup(id){
        return Element.find.call(Element, "type:element id:" + id)
    }

    static lookupType(type, name){
        return Element.find(`type:element prop:type=${type} prop:name=${name}`)
    }

    toObj(skipContent){
        return {
            id: this._id, 
            type: this.type, 
            name: this.name, 
            metadata: skipContent ? undefined : this.metadata
        }
    }
}

module.exports = Element