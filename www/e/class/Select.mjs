import {getTableData} from "../../datamanagement/data.mjs"

export default class Select{
  constructor(buffer){
    this.buffer = buffer
    this.compareFunction = null
  }

  firstonly(){
    return this;
  }

  where(compareFunction){
    this.compareFunction = compareFunction
    return this;
  }

  async fetch(){
    let res = (await getTableData(this.buffer.TableId)).filter(this.compareFunction||(() => true))[0]||null
    if(res)
      Object.assign(this.buffer, res)
    else
      this.buffer.clear();
  }
}