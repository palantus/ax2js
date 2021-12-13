import Entity from "entitystorage"

export default class Element extends Entity{
    
    initNew(type, name){
        this.type = type;
        this.name = name;
        this.tag("element")
    }

    static async init(){
        await Entity.init("./data");
    }

    static lookup(id){
        return Element.find("id:" + id)
    }

    static lookupType(type, name){
        return Element.find(`tag:element prop:type=${type} prop:name=${name}`)
    }

    toObj(){
      let obj = {id: this._id}
      Object.assign(obj, this.props);
      obj.children = this.rels
      for(let rel in obj.children){
        if(rel == "element" || rel == "xpp" || rel == "js" || rel == "ast"){
          obj.parentElementId = obj.children[rel][0]._id
          delete obj.children[rel]
        } else {
          /*
          if(this.tags.includes("formcontrol") && rel == "tableField")
            obj[rel] = obj.children[rel][0].toObj();
          else if(this.tags.includes("tablefield") && rel == "type")
            obj[rel] = obj.children[rel][0].toObj();
          else
          */
          obj.children[rel] = obj.children[rel].map(e => Element.from(e).toObj())
        }
      }


      return obj;
    }
}