// Example PropertyError:
// {
//     location: body[2],
//     value: "%%%",
//     msg: "Must be a number"
// }
module.exports = class PropertyError {
    constructor(location, value = "", msg) {
        this.location = location;
        this.value = value;
        this.message = msg;
    }
}