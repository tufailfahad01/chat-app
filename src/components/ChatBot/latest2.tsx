import { useState } from "react";
import ChatBot from "react-chatbotify";

import { ChatBotSettings, ChatBotStyles } from "./settings";
import "./index.css";
import axios from "axios";

const DottedLoader = () => {
  return (
    <div className="dotted-loader">
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
const CustomChatBotLatest2 = ({ onChatToggle }: any) => {
  // Define the help options for the chatbot.
  const [helpOptions, setHelpOptions] = useState([
    "Ask About GenderGP",
    "Ask Agent?",
  ]);
  const [subscriberOptions, setSubscriberOptions] = useState(["Yes", "No"]);
  const [answersFound, setAnswersFound] = useState(["Yes", "Ask Agent?"]);
  const [closeOptions, setCloseOptions] = useState(["Close Chat"]);
  const [agentResponse, setAgentResponse] = useState(null); // State to store API response
  const [messages, setMessages] = useState([]);

  // Define the chatbot's flow.
  const flow = {
    start: {
      message:
        "Hi there! Welcome to GenderGP! Our chat bot is here to connect you with one of our helpful agents! Could you please start off by giving me your full name?",
      transition: { duration: 1000 },
      path: "get_email",
    },

    get_email: {
      message: "",
      path: "email_information",
    },

    email_information: {
      message: "And would you now share with me your email address?",
      path: "subscriber_information",
    },

    subscriber_information: {
      message:
        "Greate! And could you please tell us whether you are already a subscriber of GenderGP or not?",
      chatDisabled: true,
      options: subscriberOptions,
      path: "process_subscriber_options",
    },

    process_subscriber_options: {
      transition: { duration: 0 },
      chatDisabled: true,
      path: async (params: any) => {
        switch (params.userInput) {
          case "Yes":
            return "show_options";
          case "No":
            return "show_options";
          default:
            return "show_options";
        }
      },
    },

    show_options: {
      message:
        "Here are a few helpful " + "things you can check out to get started:",
      chatDisabled: true,
      options: helpOptions,
      path: "process_options",
    },

    enableChat: {
      message: "",
      chatDisabled: false,
      options: closeOptions,
      path: "process_options",
    },

    prompt_again: {
      options: helpOptions,
      path: "process_options",
    },
    disable_prompt_again: {
      options: helpOptions,
      chatDisabled: true,
      path: "process_options",
    },

    answer_information: {
        options: answersFound,
        chatDisabled: true,
        path: "process_answer_options"
    },

    process_close_options: {
      transition: { duration: 0 },
      chatDisabled: true,
      path: async (params: any) => {
        await params.injectMessage("Thank you for using GenderGP. Goodbye!");
        return "show_options";
      },
    },

    process_answer_options: {
        transition: { duration: 0 },
        chatDisabled: true,
        path: async (params: any) => {
            switch(params.userInput) {
                case "Yes":
                    return "process_close_options";
                case "Ask Agent?":
                    return "process_options";
            }
            return "show_options";
          },
    },

    process_options: {
      // Disable chat during processing.
      transition: { duration: 0 },
      chatDisabled: true,
      path: async (params: any) => {
        console.log("params.userInput", params.userInput);
        if (params.userInput === "Close Chat") {
          return "process_close_options";
        } else {
          switch (params.userInput) {
            case "Ask About GenderGP":
              await params.injectMessage(
                "As a frontline healthcare assistant for GenderGP, I'm here to provide information and support regarding gender-affirming care. If you have any questions about gender identity, transitioning, or accessing healthcare services, feel free to ask! 🏳️‍🌈"
              );
              await params.injectMessage(
                "Did you find your answer?"
                );
              return "answer_information";
            case "Ask Agent?":
              await params.injectMessage(
                <div id="loader-wrapper">
                  <DottedLoader />
                </div>
              );

              // Call the API when "Agent" is selected
              try {
                const response = await axios.get("http://localhost:3003/chat", {
                  headers: {
                    Authorization: "XApHduQiRUp9GTQL6Q2nOuGMq1yF0YXR",
                  },
                });
                document.getElementById("loader-wrapper")?.remove();
                setAgentResponse(response.data); // Save the response in state
                await params.injectMessage(
                  "Hi I'm a repesentative from Gender GP. How can I help you?"
                );
                return "enableChat";
              } catch (error) {
                document.getElementById("loader-wrapper")?.remove();
                await params.injectMessage(
                  "Sorry, I couldn't reach the Agent at this time."
                );
              }
              // return "repeat";
              break;
            default:
              console.log("default mesage", params.userInput);
              const message = params.userInput;
              await params.injectMessage(
                <div id="loader-wrapper">
                  <DottedLoader />
                </div>
              );
              try {
                const response = await axios.post(
                  "http://localhost:3003/message",
                  {
                    chat_history: [],
                    query: message,
                  },
                  {
                    headers: {
                      Authorization: "XApHduQiRUp9GTQL6Q2nOuGMq1yF0YXR",
                    },
                  }
                );
                document.getElementById("loader-wrapper")?.remove();
                setAgentResponse(response.data); // Save the response in state
                if (response?.data?.reply) {
                  await params.injectMessage(response.data.reply);
                  return "enableChat";
                } else {
                  await params.injectMessage(
                    "Sorry, I couldn't reach the Agent at this time."
                  );
                }
              } catch (error) {
                document.getElementById("loader-wrapper")?.remove();
                await params.injectMessage(
                  "Sorry, I couldn't reach the Agent at this time."
                );
              }
          }
        }
      },
    },

    repeat: {
      transition: { duration: 1000 },
      path: "prompt_again",
    },
  };
  // Render the chatbot using the defined settings and flow.
  return (
    <ChatBot settings={ChatBotSettings} flow={flow} styles={ChatBotStyles} />
  );
};

export default CustomChatBotLatest2;
