
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useState, useRef } from "react";
const Chat = () => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [isOpened, setIsOpened] = useState(false);
    const endRef = useRef(null)
    const [messages, setMessages] = useState([]); // Отправка сообщения
    const messagesRef = useRef(null); // Автоматическая прокрутка вниз

    useEffect(() => {
        endRef.current?.scrollIntoView({ behaivor: "smooth" });
    }, [])
    const handleToggle = () => {
        setIsOpened(!isOpened);
    };

    const handleEmoji = e => {
        setText(prev => prev + e.emoji);
        setOpen(false);
    }
    const sendMessage = () => {
        if (text.trim() !== "") {
            const newMessage = {
                id: Math.random().toString(),
                text: text,
                sender: "user", // Имя отправителя
                timestamp: new Date().toLocaleString() // Можно выбрать формат времени
            };

            setMessages(prevMessages => [...prevMessages, newMessage]);
            setText("");
        }
    };
    useEffect(() => {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }, [messages]);
    const handleKeyPress = e => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div className='chat'>
            <div className="top">
                <div className="user">
                    <img src="./userimg.jpg" alt="" />
                    <div className="texts">
                        <span>Konstantin</span>
                        <p>last seen 3 minutes ago</p>
                    </div>
                </div>
                <div className="icons">
                    <img src="./search.svg" alt="" />
                    <img src="./menuV.svg" alt="" onClick={handleToggle} />
                    {isOpened && (
                        <div className="details">
                            <p>Chat info</p>
                        </div>
                    )}
                </div>
            </div>

            {
            }

            <div className="center" ref={messagesRef}>
                <div className="message">
                    <img src="./userimg.jpg" alt="" />
                    <div className="texts">
                        <img src="./userimg.jpg" alt="" />
                        <p>This is not my message<br /><span>12:21</span></p>
                    </div>
                </div>

                <div className="message own">
                    <div className="texts">
                        <img src="./userimg.jpg" alt="" />
                        <p>This is AGAIN my message<br /><span>12:23</span></p>
                    </div>
                </div>

                {messages.map(message => (
                    <div className={`message ${message.sender === "user" ? "own" : ""}`} key={message.id}>
                        <div className="texts">
                            <p>{message.text}<br /><span>{message.timestamp}</span></p>
                        </div>
                    </div>
                ))}


                <div ref={endRef}></div>
            </div>





            <div className="bottom">
                <div className="emoji">
                    <img src="./emoji.svg" alt="" onClick={() => setOpen(prev => !prev)} />

                    <div className="picker">
                        <EmojiPicker open={open} onEmojiClick={handleEmoji} />
                    </div>
                </div>
                <input
                    type="text"
                    placeholder="Type a message"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyPress={handleKeyPress}
                />

                <div className="icons">
                    <img src="./sendPlane.svg" alt="" onClick={sendMessage} />
                </div>
                <div className="icons">
                    <img src="./clip.svg" alt="" />
                </div>
            </div>
        </div>
    )
}

export default Chat;