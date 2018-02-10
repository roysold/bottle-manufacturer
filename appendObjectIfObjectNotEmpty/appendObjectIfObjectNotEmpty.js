function appendObjectIfObjectNotEmpty(list, obj) {
    if (Object.keys(obj).length) {
        list.push(obj);
    }
}

module.exports = appendObjectIfObjectNotEmpty;