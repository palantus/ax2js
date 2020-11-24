let Entity = require("entitystorage")
class Element extends Entity{
    
    initNew(id, type, name, layer, content){
        this.id = id;
        this.type = type;
        this.name = name;
        this.layer = layer;
        this.content = content;
        this.tag("element")
    }

    static async init(){
        await Entity.init("./data");
    }

    static lookup(id){
        return Element.find.call(Element, "type:element prop:id=" + id)
    }

    toObj(skipContent){
        return {id: this.id, type: this.type, name: this.name, layer: this.layer, content: skipContent ? undefined : this.content}
    }
}

module.exports = Element