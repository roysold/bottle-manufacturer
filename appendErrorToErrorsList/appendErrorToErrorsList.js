import _ from "lodash";

export default function appendErrorToErrorsList(errorsList, errorObj) {
    if (!_.isEmpty(Object.keys(errorObj))) {
        errorsList.push(errorObj);
    }
}