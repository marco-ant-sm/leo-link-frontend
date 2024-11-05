import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const ChatComponent = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([{ text: "Hola, soy Leo-Link AI. ¿Cómo puedo ayudarte hoy?", isUser: false, isNew: true }]);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const messageInputRef = useRef(null);
    const chatMessagesRef = useRef(null);


    const handleChatButtonClick = () => {
        setIsChatOpen(prev => !prev);
        if (isChatOpen) {
            messageInputRef.current.value = '';
        }
    };

    const handleCloseChat = () => {
        setIsChatOpen(false);
        messageInputRef.current.value = '';
    };

    const handleSendMessage = async () => {
        const message = messageInputRef.current.value.trim()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/g, '')
        .toLowerCase();

        console.log(message);

        let messageChatBox = messageInputRef.current.value.trim();

        if (message && !isBotTyping) {
            setMessages(prev => [...prev, { text: messageChatBox, isUser: true }]);
            messageInputRef.current.value = '';
            scrollToBottom();

            setIsBotTyping(true);

            try {
                const response = await axios.post(
                    "http://localhost:5005/webhooks/rest/webhook",
                    {
                        sender: "user",
                        message: message,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );

                const botResponses = response.data;

                setTimeout(() => {
                    if (botResponses.length === 0) {
                        setMessages(prev => [...prev, { text: "Lo siento, no tengo una respuesta para eso.", isUser: false, isNew: true }]);
                    } else {
                        botResponses.forEach(res => {
                            setMessages(prev => [...prev, { text: res.text, isUser: false, isNew: true }]);
                        });
                    }
                    setIsBotTyping(false);
                    scrollToBottom();
                }, 1000);

            } catch (error) {
                console.error("Error al enviar mensaje:", error);
                setTimeout(() => {
                    setMessages(prev => [...prev, { text: "Lo lamento, ahora presento problemas. Inténtalo más tarde.", isUser: false, isNew: true }]);
                    setIsBotTyping(false);
                    scrollToBottom();
                }, 1000);
            }
        }
    };

    const scrollToBottom = () => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMessages(messages.map(msg => ({ ...msg, isNew: false })));
        }, 2000);

        return () => clearTimeout(timer);
    }, [messages]);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div>
            <button
                className="chat-button btn btn-dark"
                onClick={handleChatButtonClick}
            >
                <i className="bi bi-chat"></i>
            </button>

            {isChatOpen && (
                <div className="chat-box bg-dark text-white">
                    <div className="chat-header">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span>Leo-link AI</span>
                            <span style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor: '#39ff14',
                                display: 'inline-block',
                                marginLeft: '0.5rem'
                            }}></span>
                        </div>
                        <button className="btn-close btn-close-white" onClick={handleCloseChat}></button>
                    </div>
                    <div className="chat-messages" ref={chatMessagesRef}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`message-container ${msg.isUser ? 'user-message-container' : 'bot-message-container'}`}>
                                <div className={`message ${msg.isUser ? 'user-message' : 'bot-message'}`}>
                                    {msg.isUser ? (
                                        msg.text
                                    ) : (
                                        <div className={`typewriter ${!msg.isNew ? 'no-animation' : ''}`}>
                                            {msg.text}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isBotTyping && (
                            <div className="text-center">
                                <div className="spinner-grow text-light" role="status">
                                    <span className="sr-only">Escribiendo...</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            ref={messageInputRef}
                            placeholder="Escribe un mensaje"
                            onKeyDown={handleKeyDown}
                            disabled={isBotTyping}
                            className="form-control"
                        />
                        <button className="btn btn-primary" onClick={handleSendMessage} disabled={isBotTyping}>
                            Enviar
                        </button>
                    </div>
                </div>
            )}

            <style>
                {`
                    body {
                        position: relative;
                    }

                    .chat-button {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        width: 60px;
                        height: 60px;
                        border-radius: 50%;
                        color: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 24px;
                        cursor: pointer;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                        transition: background-color 0.3s;
                        z-index: 1000;
                    }

                    .chat-box {
                        position: fixed;
                        bottom: 80px;
                        right: 20px;
                        width: 350px;
                        height: 500px;
                        border: 1px solid #ccc;
                        border-radius: 8px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                        display: flex;
                        flex-direction: column;
                        z-index: 1000;
                    }

                    .chat-header {
                        background-color: #343a40;
                        color: white;
                        padding: 10px;
                        border-top-left-radius: 8px;
                        border-top-right-radius: 8px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }

                    .chat-messages {
                        flex: 1;
                        padding: 10px;
                        overflow-y: auto;
                        display: flex;
                        flex-direction: column;
                    }

                    .chat-input {
                        display: flex;
                        padding: 10px;
                    }

                    .chat-input input {
                        flex: 1;
                        border-radius: 6px;
                        margin-right: 10px;
                    }

                    .message-container {
                        display: flex;
                        margin-bottom: 10px;
                        max-width: 100%;
                    }

                    .user-message-container {
                        justify-content: flex-end;
                    }

                    .bot-message-container {
                        justify-content: flex-start;
                    }

                    .message {
                        padding: 10px;
                        border-radius: 18px;
                        max-width: 80%;
                        word-wrap: break-word;
                        font-size: 0.9em;
                        line-height: 1.4;
                    }

                    .user-message {
                        background-color: #007bff;
                        color: white;
                    }

                    .bot-message {
                        background-color: #495057;
                        color: white;
                    }

                    .typewriter {
                        overflow: hidden;
                        white-space: pre-wrap;
                        word-break: break-word;
                        animation: typing 2s steps(40, end);
                    }

                    .typewriter.no-animation {
                        animation: none;
                    }

                    @keyframes typing {
                        from { max-height: 0 }
                        to { max-height: 1000px }
                    }

                    /* Estilos para hacer el chat responsivo */
                    @media (max-width: 400px) {
                        .chat-box {
                            width: 100%;
                            height: 100%;
                            bottom: 0;
                            right: 0;
                            border-radius: 0;
                        }

                        .chat-button {
                            bottom: 10px;
                            right: 10px;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default ChatComponent;

// import React, { useState, useRef, useEffect } from 'react';

// const ChatComponent = () => {
//     const [isChatOpen, setIsChatOpen] = useState(false);
//     const [messages, setMessages] = useState([]);
//     const [isBotTyping, setIsBotTyping] = useState(false);
//     const messageInputRef = useRef(null);
//     const chatMessagesRef = useRef(null);
//     const botHasResponded = useRef(false); // Ref para controlar si el bot ha respondido

//     const handleChatButtonClick = () => {
//         setIsChatOpen(prev => !prev);
//         if (isChatOpen) {
//             messageInputRef.current.value = ''; // Limpiar el input al cerrar el chat
//         }
//     };

//     const handleCloseChat = () => {
//         setIsChatOpen(false);
//         messageInputRef.current.value = ''; // Limpiar el input al cerrar el chat
//         botHasResponded.current = false; // Reiniciar el estado al cerrar
//     };

//     const handleSendMessage = () => {
//         const message = messageInputRef.current.value.trim();
//         if (message && !isBotTyping) {
//             setMessages(prev => [...prev, { text: message, isUser: true }]);
//             messageInputRef.current.value = '';
//             scrollToBottom();

//             // Bot typing simulation
//             setIsBotTyping(true);
//             botHasResponded.current = false; // Resetea el estado del bot

//             setTimeout(() => {
//                 const botResponse = 'Mensaje bot'; // Bot response
//                 setMessages(prev => [...prev, { text: botResponse, isUser: false }]);
//                 setIsBotTyping(false);
//                 botHasResponded.current = true; // Marcar que el bot ha respondido
//             }, 2000);
//         }
//     };

//     const scrollToBottom = () => {
//         if (chatMessagesRef.current) {
//             chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
//         }
//     };

//     // Use effect to scroll down whenever messages change
//     useEffect(() => {
//         scrollToBottom();
//     }, [messages]);

//     const handleKeyDown = (event) => {
//         if (event.key === 'Enter') {
//             handleSendMessage();
//         }
//     };

//     return (
//         <div>
//             {/* Botón de chat */}
//             <button
//                 className="chat-button btn btn-dark"
//                 onClick={handleChatButtonClick}
//             >
//                 <i className="bi bi-chat"></i>
//             </button>

//             {/* Cuadro de chat */}
//             {isChatOpen && (
//                 <div className="chat-box bg-dark text-white">
//                     <div className="chat-header">
//                         <span>Leo-link AI</span>
//                         <button className="btn-close btn-close-white" onClick={handleCloseChat}></button>
//                     </div>
//                     <div className="chat-messages" ref={chatMessagesRef}>
//                         {messages.map((msg, index) => (
//                             <div key={index} className={`message ${msg.isUser ? 'user-message' : 'bot-message'}`}>
//                                 {msg.isUser ? msg.text : (
//                                     <div className={`typewriter ${botHasResponded.current ? 'no-animation' : ''}`}>
//                                         {msg.text}
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                         {isBotTyping && !botHasResponded.current && (
//                             <div className="text-center">
//                                 <div className="spinner-grow text-light" role="status">
//                                     <span className="sr-only">Escribiendo...</span>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                     <div className="chat-input">
//                         <input
//                             type="text"
//                             ref={messageInputRef}
//                             placeholder="Escribe un mensaje..."
//                             onKeyDown={handleKeyDown}
//                             disabled={isBotTyping}
//                             className="form-control"
//                         />
//                         <button className="btn btn-primary" onClick={handleSendMessage} disabled={isBotTyping}>
//                             Enviar
//                         </button>
//                     </div>
//                 </div>
//             )}

//             <style>
//                 {`
//                     body {
//                         position: relative;
//                     }

//                     .chat-button {
//                         position: fixed;
//                         bottom: 20px;
//                         right: 20px;
//                         width: 60px;
//                         height: 60px;
//                         border-radius: 50%;
//                         color: white;
//                         display: flex;
//                         align-items: center;
//                         justify-content: center;
//                         font-size: 24px;
//                         cursor: pointer;
//                         box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
//                         transition: background-color 0.3s;
//                         z-index: 1000;
//                     }

//                     .chat-box {
//                         position: fixed;
//                         bottom: 80px;
//                         right: 20px;
//                         width: 300px;
//                         max-height: 400px;
//                         border: 1px solid #ccc;
//                         border-radius: 8px;
//                         box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
//                         display: flex;
//                         flex-direction: column;
//                         z-index: 1000;
//                     }

//                     .chat-header {
//                         background-color: #343a40; /* Dark Bootstrap color */
//                         color: white;
//                         padding: 10px;
//                         border-top-left-radius: 8px;
//                         border-top-right-radius: 8px;
//                         display: flex;
//                         justify-content: space-between;
//                         align-items: center;
//                     }

//                     .chat-messages {
//                         flex: 1;
//                         padding: 10px;
//                         overflow-y: auto;
//                     }

//                     .chat-input {
//                         display: flex;
//                         padding: 10px;
//                     }

//                     .chat-input input {
//                         flex: 1;
//                         border-radius: 4px;
//                         margin-right: 10px;
//                     }

//                     .message {
//                         padding: 10px;
//                         border-radius: 4px;
//                         margin-bottom: 10px;
//                         font-size: 1em; /* Tamaño de letra accesible */
//                     }

//                     .user-message {
//                         background-color: white; /* Color para mensajes del usuario */
//                         color: black;
//                         align-self: flex-end; /* Alinear a la derecha */
//                     }

//                     .bot-message {
//                         background-color: #495057; /* Dark color for bot messages */
//                         color: white; /* Text color for bot messages */
//                         align-self: flex-start; /* Alinear a la izquierda */
//                     }

//                     .typewriter {
//                         color: white;
//                         font-family: monospace;
//                         overflow: hidden; /* Ensures the content is not revealed until the animation */
//                         white-space: nowrap; /* Keeps the content on a single line */
//                         margin: 0 auto; /* Gives that scrolling effect as the typing happens */
//                         letter-spacing: .15em; /* Adjust as needed */
//                         animation: 
//                             typing 2.5s steps(30, end);
//                     }

//                     /* The typing effect */
//                     @keyframes typing {
//                         from { width: 0 }
//                         to { width: 100% }
//                     }
//                 `}
//             </style>
//         </div>
//     );
// };

// export default ChatComponent;
