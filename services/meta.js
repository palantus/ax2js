
import Element from "../models/element.js"

class Service{

  async getLabels(){
    
    let labelFiles = Element.search("tag:element prop:type=labelfile prop:language=da");
    let ret = {}
    for(let file of labelFiles)
      Object.assign(ret, JSON.parse(await this.streamToString(file.blob)))
    return ret
  }

  async streamToString (stream) {
    const chunks = []
    return new Promise((resolve, reject) => {
      /*
      stream.on('data', chunk => chunks.push(chunk))
      stream.on('error', reject)
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
      */
      stream.setEncoding('utf8');
      stream.on('data', data => resolve(data))
      stream.on('end', () => null)
    })
  }
}



export default new Service()