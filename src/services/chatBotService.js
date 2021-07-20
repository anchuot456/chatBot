import request from "request";
import { axiosGuestInstance } from "../api/chatBotAPI";
require("dotenv").config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

const IMAGE_GET_STARTED =
  "https://ejoy-english.com/blog/wp-content/uploads/2017/11/learn-and-study.jpg";
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: "https://graph.facebook.com/v2.6/me/messages",
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log("message sent!");
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
}

const getData = async () => {
  const bestSellerCoursesRes = await axiosGuestInstance.get(
    `/courses?sortBy=subscriberNumber:desc&limit=4`
  );
  const categoriesRes = await axiosGuestInstance.get(`/categories`);
  const subCategoriesRes = await axiosGuestInstance.get(`/subCategories`);
  console.log(categoriesRes.data);
  return {
    bestSellerCoursesRes: bestSellerCoursesRes,
    categoriesRes: categoriesRes,
    subCategoriesRes: subCategoriesRes,
  };
};

const handleGetStarted = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response1 = { text: `Welcome to Study Files` };
      const response2 = sendGetStartedTemplate();

      await callSendAPI(sender_psid, response1);
      await callSendAPI(sender_psid, response2);
      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};

const sendGetStartedTemplate = () => {
  const response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Can i help you?",
            subtitle: "Tap a button to answer.",
            image_url: IMAGE_GET_STARTED,
            buttons: [
              {
                type: "postback",
                title: "Search course",
                payload: "SEARCH_COURSE",
              },
              {
                type: "postback",
                title: "Search category",
                payload: "SEARCH_CATEGORY",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};

const categoryCard = (category) => {
  const card = {
    title: category.name,
    image_url: IMAGE_GET_STARTED,
    buttons: [
      {
        type: "postback",
        title: "Search subcategory",
        payload: "SEARCH_SUBCATEGORY",
      },
    ],
  };
  return card;
};

const sendCategory = () => {
  const categoriesRes = await axiosGuestInstance.get(`/categories`);
  const response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: categoriesRes.data.map((category) => {
          categoryCard(category);
        }),
      },
    },
  };
  return response;
};

const handleGetCategory = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = sendCategory();

      await callSendAPI(sender_psid, response);
      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getData,
  handleGetStarted,
  handleGetCategory,
};
