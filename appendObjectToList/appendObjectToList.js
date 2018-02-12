module.exports = function appendObjectToList(list, obj) {
    if (Object.keys(obj).length) {
        list.push(obj);
    } else {
        throw "Object is empty."
    }
}