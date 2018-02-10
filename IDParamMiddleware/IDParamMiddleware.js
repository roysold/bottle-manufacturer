const getIndexByID = (list, id) => list.findIndex(item => item.id === id);

function setIndexOfObjectByID(collection) {
    return (req, res, next) => {
        res.locals.indexOfObjectByID =
            getIndexByID(collection, req.params.id);

        next();
    }
}

const deleteFromCollectionByID = collection => collection.splice(res.locals.indexOfObjectByID, 1);

module.exports = {
    setIndexOfObjectByID: setIndexOfObjectByID,
    deleteFromCollectionByID: deleteFromCollectionByID
};