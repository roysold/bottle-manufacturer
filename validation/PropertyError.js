// Example PropertyError:
// {
//     location: body[2],
//     value: "%%%",
//     msg: "Must be a number"
// }
export default class PropertyError {
    constructor(location, value = "", msg) {
        this.location = location;
        this.value = value;
        this.message = msg;
    }
}