import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

import { NextApiResponseServerIo } from "@/types";

// Configuration for the Next.js API route
export const config = {
  api: {
    // Disable bodyParser for handling WebSocket connections
    bodyParser: false,
  },
};

// Handler function for the WebSocket API route
const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  // Check if the WebSocket instance is not already attached to the server
  if (!res.socket.server.io) {
    // Define the WebSocket path
    const path = "/api/socket/io";

    // Get the HTTP server from the response socket
    const httpServer: NetServer = res.socket.server as any;

    // Create a new socket.io server instance and attach it to the HTTP server
    const io = new ServerIO(httpServer, {
      path: path,
      // @ts-ignore: Ignore TypeScript error about addTrailingSlash
      addTrailingSlash: false,
    });

    // Attach the created socket.io server instance to the HTTP server to share the connection
    res.socket.server.io = io;
  }

  // End the response since WebSocket connections do not follow the typical request-response model
  res.end();
}

// Export the WebSocket handler function
export default ioHandler;
