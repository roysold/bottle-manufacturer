const getIndexByID = (list, id) => list.findIndex(item => item.id === id);
const deleteFromCollectionByID = (collection, index) => collection.splice(index, 1);

module.exports = {
    getIndexByID: getIndexByID,
    deleteFromCollectionByID: deleteFromCollectionByID
};