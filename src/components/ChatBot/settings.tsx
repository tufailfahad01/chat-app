import logo from '../../brand-logo-white.svg'

const ChatBotStyles = {
  headerStyle: { background: "#F24769", color: "#FFFFFF" },
  chatBoxStyle: {
    background: "#F24769", // Background color for the chat box
  },
  botBubbleStyle: {
    // background: "#F24769", // Background color for message bubbles
    border: '1px solid #F24769',
    background: '#ffffff',
    color: "#000000", // Text color for message bubbles
  },
  botOptionStyle: {
    border: "1px solid #F24769", // Color for options
    color: "black",
  },
  botOptionHoveredStyle: {
    background: "#F24769", // Color for options
    color: "white",
  },
  loadingSpinnerStyle: {
    backgroundColor: "#ffffff", // Background color for buttons
    color: "#fff", // Text color for buttons
    border: "1px solid #F24769",
  },
  sendButtonHoveredStyle: {
    backgroundColor: "#F24769", // Background color for buttons
    color: "#fff", // Text color for buttons
  },
  sendButtonStyle: {
    backgroundColor: "#F24769", // Background color for buttons
    color: "#fff", // Text color for buttons
  },
  chatInputAreaStyle: {
    border: "1px solid #F24769",
  },
  tooltipStyle: {
    background: "#F24769",
    color: "white",
    fontSize: '12px'
  },
  userBubbleStyle: {
    background: "#F24769",
    color: "white",
  },
  chatButtonStyle: {
    background: "#F24769",
  },
  closeChatIconStyle: {
    width: '20px',
    height: '20px'
  }
};

const ChatBotSettings: any = {
  notification: { disabled: true },
  header: { 
    title: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img 
          src={logo} 
          alt="Logo" 
          style={{ width: '120px', height: '120px', marginRight: '10px' }} 
        />
      </div>
    ), 
    showAvatar: false 
  },
  footer: {
    text: (
      <p>
        Powered by <b>Gender GP</b>
      </p>
    ),
  },
  fileAttachment: { showMediaDisplay: true,types: ["file"], accept: ".png, .jpg, .jpeg, .pdf, .doc, .docx" },
  botBubble: {simStream: true},
  tooltip: {
    text: 'Need Help?'
  },
  chatWindow: {
    showMessagePrompt: true,
  },
}


export { ChatBotSettings, ChatBotStyles }