"use client";
import { 
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { io as ClientIO } from "socket.io-client";

// Define the type for the context value
type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};

// Create a context with an initial value
const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

// Custom hook to easily access the socket context
export const useSocket = () => {
  return useContext(SocketContext);
};

// SocketProvider component to manage the WebSocket connection state
export const SocketProvider = ({ 
  children 
}: { 
  children: React.ReactNode 
}) => {
  // State variables to track the socket instance and connection status
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // useEffect to initialize the socket connection and handle events
  useEffect(() => {
    // Create a new socket instance using the socket.io-client library
    const socketInstance = new (ClientIO as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    // Event listener for the "connect" event
    socketInstance.on("connect", () => {
      setIsConnected(true); // Update the connection status
    });

    // Event listener for the "disconnect" event
    socketInstance.on("disconnect", () => {
      setIsConnected(false); // Update the connection status
    });

    // Set the socket instance in the state
    setSocket(socketInstance);

    // Cleanup function to disconnect the socket when the component unmounts
    return () => {
      socketInstance.disconnect();
    };
  }, []); // The empty dependency array ensures that the effect runs only once on component mount

  // Provide the socket context value to the nested components
  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
