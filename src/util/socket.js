import { io } from "socket.io-client";

function createSocket(url, jwt) {
    const socket = io(url, {
        autoConnect: false,
        query: {
            'authorization': jwt
        }
    });

    socket.onAny((event, ...args) => {
        console.log(event, args); // debug only
    });

    return socket
}

export default createSocket;