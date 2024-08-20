import { useState } from "react";
import ChatBot from "react-chatbotify";

import { ChatBotSettings, ChatBotStyles } from "./settings";
import "./index.css";
import axios from "axios";

const DottedLoader = () => {
  return (
    <div className="dotted-loader">
      {/* <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div> */}
      <div style={{ color: "#D3D3D3", fontSize: "12px" }}>
        Agent is typing......
      </div>
    </div>
  );
};

/**
 * MyChatBot component is a functional component that renders a chatbot using the
 * react-chatbotify library. It defines the chatbot's flow and settings.
 *
 * @returns {JSX.Element} The JSX element representing the chatbot.
 */
const CustomChatBot = ({ onChatToggle }: any) => {
  // Define the help options for the chatbot.
  const [helpOptions, setHelpOptions] = useState([
    "Quickstart",
    "API Docs",
    "Examples",
    "Github",
    "Discord",
    "Ask Agent?",
  ]);

  const [agentResponse, setAgentResponse] = useState(null); // State to store API response

  // Define the chatbot's flow.
  const flow = {
    /**
     * The start state of the chatbot.
     */
    start: {
      message:
        "Hello, 👋! Welcome to Gender GP, I'm excited that you are using our " +
        "chatbot 😊!",
      // Set a transition duration for the message.
      transition: { duration: 1500 },
      // Set the next state to show options.
      path: "show_options",
    },
    /**
     * The state to show options to the user.
     */
    show_options: {
      message:
        "Here are a few helpful " + "things you can check out to get started:",
      // Set the options for the user to choose from.
      options: helpOptions,
      // Set the next state to process options.
      path: "process_options",
    },
    /**
     * The state to prompt the user for additional help.
     */
    prompt_again: {
      message: "Do you need any other help?",
      // Set the options for the user to choose from.
      options: helpOptions,
      // Set the next state to process options.
      path: "process_options",
    },
    /**
     * The state for when the user's input is not understood.
     */
    unknown_input: {
      message:
        "Sorry, I do not understand your message 😢! If you require further assistance, you may click on " +
        "the Github option and open an issue there or visit our discord.",
      // Set the options for the user to choose from.
      options: helpOptions,
      // Set the next state to process options.
      path: "process_options",
    },
    /**
     * The state for processing the user's options.
     *
     * @param {Object} params - The parameters for the state.
     * @param {string} params.userInput - The user's input.
     * @returns {string|Promise<void>} The next state or a promise that resolves to the next state.
     */
    process_options: {
      // Disable chat during processing.
      transition: { duration: 0 },
      chatDisabled: true,
      path: async (params: any) => {
        let link = "";
        // Set the link based on the user's input.
        switch (params.userInput) {
          case "Quickstart":
            link = "https://react-chatbotify.com/docs/introduction/quickstart/";
            break;
          case "API Docs":
            link = "https://react-chatbotify.com/docs/api/settings";
            break;
          case "Examples":
            link = "https://react-chatbotify.com/docs/examples/basic_form";
            break;
          case "Github":
            link = "https://github.com/tjtanjin/react-chatbotify/";
            break;
          case "Discord":
            link = "https://discord.gg/6R4DK4G5Zh";
            break;
          case "Ask Agent?":
            await params.injectMessage(
              <div id="loader-wrapper">
                <DottedLoader />
              </div>
            );

            // Call the API when "Agent" is selected
            try {
              const response = await axios.get("http://localhost:3002/chat", {
                headers: {
                  Authorization: "XApHduQiRUp9GTQL6Q2nOuGMq1yF0YXR",
                },
              });
              document.getElementById("loader-wrapper")?.remove();
              setAgentResponse(response.data); // Save the response in state
              await params.injectMessage(
                "I've received a response from the Agent. What would you like to do next?"
              );
            } catch (error) {
              document.getElementById("loader-wrapper")?.remove();
              await params.injectMessage(
                "Sorry, I couldn't reach the Agent at this time."
              );
            }
            return "repeat";
          default:
            const message = params.userInput;
            await params.injectMessage("Sit tight! I'll send you right there!");
            try {
              const response = await axios.get("http://localhost:3002/chat", {
                headers: {
                  Authorization: "XApHduQiRUp9GTQL6Q2nOuGMq1yF0YXR",
                },
              });
              setAgentResponse(response.data); // Save the response in state
              await params.injectMessage(
                "I've received a response from the Agent. What would you like to do next?"
              );
            } catch (error) {
              await params.injectMessage(
                "Sorry, I couldn't reach the Agent at this time."
              );
            }
            // return "unknown_input";
        }
        // Inject a message and return the next state.
        return "repeat";
      },
    },
    /**
     * The state to prompt the user for additional help.
     */
    repeat: {
      // Set a transition duration for the message.
      transition: { duration: 1000 },
      // Set the next state to prompt again.
      path: "prompt_again",
    },
  };
  // Render the chatbot using the defined settings and flow.
  return (
    <ChatBot settings={ChatBotSettings} flow={flow} styles={ChatBotStyles} />
  );
};

export default CustomChatBot;
