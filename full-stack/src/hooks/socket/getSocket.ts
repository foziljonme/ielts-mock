import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:4001', {
      path: '/socket',
      transports: ['websocket'],
      withCredentials: true,
      autoConnect: false, // hook controls when to connect
    })
  }

  return socket
}
