module.exports =
    function deleteByIndex(collection, index) {
        collection.splice(index, 1)
    };