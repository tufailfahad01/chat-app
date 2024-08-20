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
};

const ChatBotSettings: any = {
  notification: { disabled: true },
  header: { title: <b>Gender GP</b>, showAvatar: false },
  footer: {
    text: (
      <p>
        Powered by <b>Gender GP</b>
      </p>
    ),
  },
  fileAttachment: { disabled: true },
  botBubble: {simStream: true},
  tooltip: {
    text: 'Need Help?'
  },
  chatWindow: {
    showMessagePrompt: true,
  },
}


export { ChatBotSettings, ChatBotStyles }