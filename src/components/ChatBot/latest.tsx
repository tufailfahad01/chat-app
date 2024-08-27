import { useState } from "react";
import ChatBot from "react-chatbotify";

import { ChatBotSettings, ChatBotStyles } from "./settings";
import "./index.css";
import axios from "axios";
import React from "react";

const DottedLoader = () => {
  return (
    <div className="dotted-loader">
      <div style={{ color: "#D3D3D3", fontSize: "12px" }}>
        Agent is typing......
      </div>
    </div>
  );
};


const LinkifyText = ({ text }:any) => {
  const urlRegex = /((http|https):\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  const updatedParts = parts.slice(0, parts.length - 2);
  console.log("parts",updatedParts)
  return (
    <p className="chatbot-message">
      {updatedParts.map((part: any, index: any) =>
        urlRegex.test(part) ? (
          <React.Fragment key={index}>
            <a href={part} target="_blank" rel="noopener noreferrer">
              {part}
            </a>
          </React.Fragment>
        ) : (
          <React.Fragment key={index}>
            {part}
          </React.Fragment>
        )
      )}
    </p>
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
    "Ask Agent?",
  ]);
  const [subscriberOptions, setSubscriberOptions] = useState(["Yes", "No"]);
  const [answersFound, setAnswersFound] = useState(["Yes", "Ask Agent?"]);
  const [closeOptions, setCloseOptions] = useState(["End Chat"]);
  const [agentResponse, setAgentResponse] = useState(null); // State to store API response
  const [callAgent,setCallAgent] = useState(false)

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  
  const handleUpload = (params: any) => {
		const files = params.files;
		// handle files logic here
	}

  // Define the chatbot's flow.
  const flow = {
    start: {
      message:
        "Hi there! Welcome to GenderGP! Our chat bot is here to connect you with one of our helpful agents!",
      transition: { duration: 1000 },
      path: async (params: any) => {
        await params.injectMessage(
          'Could you please start off by giving me your full name?'
        )
        return 'get_email'
      },
    },

    get_email: {
      message: "",
      path: "email_information",
    },

    email_information: {
      message: "And would you now share with me your email address?",
      path: async (params: any) => {
        const validEmail = validateEmail(params.userInput);
        if (!validEmail) {
            return "handle_invalid_email";
        }
        return 'subscriber_information'
      },
    },

    handle_invalid_email: {
        message: "Invalid Email Address. Please try again.",
        path: async (params: any) => {
          const validEmail = validateEmail(params.userInput);
          if (!validEmail) {
              return "handle_invalid_email";
          }
          return 'subscriber_information'
        },
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
            return "after_subscribe";
          case "No":
            return "after_subscribe";
          default:
            return "after_subscribe";
        }
      },
    },

    after_subscribe: {
      message:"Please ask your questions. Please be detailed as much as possible",
      file: (params:any) => handleUpload(params),
      path: "process_options",
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
      file: (params:any) => handleUpload(params),
      path: "process_options",
    },

    find_answers: {
      message: 'Did you find your answer?',
      chatDisabled: true,
      options: ['Yes', 'No'],
      path: 'process_find_answer_options'
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
      message:'Thank you for using GenderGP. Goodbye!',
      path: 'start'
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

    process_find_answer_options: {
      transition: { duration: 0 },
      chatDisabled: true,
      path: async (params: any) => {
          switch(params.userInput) {
              case "Yes":
                  return "process_close_options";
              case "No":
                  setCallAgent(true)
                  return "bot_reply";
          }
          return "show_options";
        },
  },
  
    bot_reply: {
      transition: { duration: 0 },
      chatDisabled: true,
      file: (params:any) => handleUpload(params),
      path: async (params: any) => {
        await params.injectMessage(
          "Hi I'm a repesentative from Gender GP. How can I help you?"
        );
        return 'enableChat'
      }
    },

    process_options: {
      // Disable chat during processing.
      transition: { duration: 0 },
      chatDisabled: true,
      path: async (params: any) => {
        if (params.userInput === "End Chat") {
          setCallAgent(false)
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
              await params.injectMessage(
                "Hi I'm a repesentative from Gender GP. How can I help you?"
              );
              document.getElementById("loader-wrapper")?.remove();
              return "enableChat";
            default:
              const message = params.userInput;
              await params.injectMessage(
                <div id="loader-wrapper">
                  <DottedLoader />
                </div>
              );
              try {
                const response: any = await axios.post(
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
                  const links = response.data.documents.filter((info:any)=> info.url)
                  const firstLink = links[0]?.url ?? ''
                  const msg = response.data.reply + ' ' + firstLink
                  await params.injectMessage(<LinkifyText text={msg} />);
                  return !callAgent ? "find_answers" : "enableChat";
                } else {
                  await params.injectMessage(
                    "Sorry, I couldn't reach the Agent at this time."
                  );
                  return 'process_options'
                }
              } catch (error) {
                document.getElementById("loader-wrapper")?.remove();
                await params.injectMessage(
                  "Sorry, I couldn't reach the Agent at this time."
                );
                return 'process_options'
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
