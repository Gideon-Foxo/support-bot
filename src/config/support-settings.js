const supportConfig = {


    // Embed for the help desk
    embed: {
        title: "Help Desk",
        description: "Demo help desk. Need help? You came to the right place, to get started just use the select menu below!\n\nSupport can setup to add the user to a private thread or add a role to the user, or both!",
        //thumbnail: "image URL for thumbnail in top right corner",
        //image: "image URL for big image at bottom",
        footer: "This is the small text at the bottom of the embed, it does not support markdown."
    },


    // The support settings
    support: {
        disableSupport: false, // Disables support
        createThread: true, // Creates a private thread. If you want to change how requestMessage and supportMessage work modify the strings in the support function in interactions.js
        supportRole: "ID of role here", // Role given to the user if extra support is requested
        requestMessage: "A support ticket has been made", // If create thread is enabled then the created thread will be automatically added to the end of the default message.
        supportMessage: "We will be with you shortly, in the meantime please ask you question in as much detail as you can!",
        supportChannel: "Support Message Channel ID",
 

        selectMenuName: "Need help? Select a question!",
        supportOption: {
            name: "My question is not answered",
            description: "I need more support!",
            emote: "❓"
        },


        loggingChannel: "ID of logging channel", // Channel for logging all questions and support status
        notificationRole: "ID of staff role", // Role for staff
    },


    // Array of questions and answers for the help desk
    questions: [
        {
            question: "What does this bot do?",
            questionDescription: "How will it help users?",
            emote: "🤖",
    
            answer: "This bot helps users answer questions in an automated format! No more pointing users to a long faq they wont really read!!",
            image: "https://cdn.discordapp.com/attachments/995986581460615178/1152729799769464863/Discord_ur4cd1FSFI.png",
            directSupport: false
        },
        {
            question: "What does the direct support option do?",
            //questionDescription: "",
            //emote: "",
    
            answer: "It adds a button to answer response that allows a user to directly request support without having to go back to the select menu and hit extra support needed.",
            //image: "",
            directSupport: true
        },
        {
            question: "I still need help with this bot, where do I go?",
            //questionDescription: "",
            //emote: "",
    
            answer: "You can either ask in our [support server](https://discord.gg/s4BX2qu6Hu) or create a new [pull request](https://github.com/Gideon-Foxo/support-bot/pulls) on our github page!",
            //image: "",
            directSupport: false
        },
        {
            question: "How can I donate to this project?",
            //questionDescription: "",
            //emote: "",
    
            answer: "You can either give me a [coffee](https://foxo.gay/donate) or donate on [github](https://github.com/sponsors/Gideon-Foxo)!",
            //image: "",
            directSupport: false
        },
        {
            question: "How many questions can I set?",
            //questionDescription: "",
            //emote: "",
    
            answer: "You can set up to 24 questions, or 25 if you do disable the extra support option.",
            //image: "",
            directSupport: false
        },
        {
            question: "Can I set custom emotes?",
            //questionDescription: "",
            emote: "<a:RainbowHeart:688554129437622273>",
    
            answer: "Yes you can! put \ before an emote and then send it and copy and past the result, it should look something like `<a:RainbowHeart:688554129437622273>`",
            //image: "",
            directSupport: false
        },
    ]

}


module.exports = supportConfig