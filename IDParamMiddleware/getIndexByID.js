export default function getIndexByID(list, id, IDPropertyName) {
    return list.findIndex(item => item[IDPropertyName] === id)
};