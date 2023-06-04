
export const getAllCollectionWithSub = (collectionData, arr=[]) => {
    collectionData.forEach((c) => {
        if (c.folders.length !== 0) {
            getAllCollectionWithSub(c.folders, arr)
        }
        c.folders.forEach((f) => {
            arr.push(f)
        })
        if (c.collection === null) {
            arr.push(c)
        }
    })
    return arr
}

export const checkCollectionExists = (collections,query) => {
    let isExist = false
    collections.forEach((c) => {
        if(c.name === query){
            isExist = true
        }
    })
    return isExist
}
