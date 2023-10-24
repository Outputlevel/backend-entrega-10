export class Response {
    constructor(status, message, payload) {
        this.status = status,
        this.message = message, 
        this.payload = payload
    }
}

export default {Response}