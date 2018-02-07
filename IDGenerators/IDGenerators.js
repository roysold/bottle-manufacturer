module.exports = function* generateNextNumericID(startID) {
    let currentID = parseInt(startID);

    while (true) {
        yield String(currentID++);
    }
}