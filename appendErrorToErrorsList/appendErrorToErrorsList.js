export default function appendErrorToErrorsList(errorsList, errorObj) {
    if (Object.keys(errorObj).length !== 0) {
        errorsList.push(errorObj);
    }
}