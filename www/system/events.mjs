let handlers = {}

export function on(eventName, id, fn){
    if(handlers[eventName] === undefined)
        handlers[eventName] = []

    handlers[eventName].push({fn, id})
}

export function off(eventName, id){
    if(handlers[eventName] === undefined)
        return;

    handlers[eventName] = handlers[eventName].filter(h => h.id != id)
}

export function fire(eventName, data){
    if(handlers[eventName] === undefined)
        return;

    handlers[eventName].forEach(h => h.fn(data))
}