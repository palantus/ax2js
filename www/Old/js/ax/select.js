class Select
{
    constructor(tableBuffer){
        this.buffer = tableBuffer;
    }

    firstonly(){
        return this;
    }

    where(conditionMethod){
        return this;
    }

    fetch(){
        //TODO: fill data into this.buffer
        console.log("Fetched data from table " + this.buffer.tableName)
    }
}