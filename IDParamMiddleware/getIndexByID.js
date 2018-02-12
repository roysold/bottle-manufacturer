module.exports =
    getIndexByID =
    (list, id, IDPropertyName) =>
        list.findIndex(item => item[IDPropertyName] === id);