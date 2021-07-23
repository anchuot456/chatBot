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
                payload: JSON.stringify({ type: "SEARCH_COURSE", value: "" }),
              },
              {
                type: "postback",
                title: "Search category",
                payload: JSON.stringify({ type: "SEARCH_CATEGORY", value: "" }),
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};

//Category
const categoryCard = (category) => {
  const card = {
    title: category.name,
    image_url: IMAGE_GET_STARTED,
    buttons: [
      {
        type: "postback",
        title: "Search courses",
        payload: JSON.stringify({
          type: `SEARCH_CATEGORY_COURSE`,
          value: category.id,
        }),
      },
    ],
  };
  return card;
};

const handleGetCategory = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const categoriesRes = await axiosGuestInstance.get(`/subCategories`);
      console.log(categoriesRes);
      const categoryList = categoriesRes.data.map((category) => {
        return categoryCard(category);
      });
      console.log(categoryList);
      const response1 = {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: categoryList,
          },
        },
      };

      await callSendAPI(sender_psid, response1);
      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};

//Category Course Card
const courseCard = (course) => {
  const card = {
    title: course.name,
    subtitle: course.detailDescription,
    image_url: IMAGE_GET_STARTED,
    buttons: [
      {
        type: "postback",
        title: "Search courses",
        payload: JSON.stringify({
          type: `SEARCH_COURSE`,
          value: course.id,
        }),
      },
    ],
  };
  return card;
};

const handleGetCategoryCourse = (sender_psid, categoryId) => {
  return new Promise(async (resolve, reject) => {
    try {
      //lấy category course
      const coursesRes = await axiosGuestInstance.get(
        `/courses?sortBy=view:desc&limit=10&subCategoryId=${categoryId}`
      );
      const courseList = coursesRes.data.results.map((course) => {
        return courseCard(course);
      });
      console.log(courseList);
      const response1 = {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: courseList,
          },
        },
      };

      await callSendAPI(sender_psid, response1);
      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};

const handleGetSearchCourse = (sender_psid, courseName) => {
  return new Promise(async (resolve, reject) => {
    try {
      //lấy course
      const coursesRes = await axiosGuestInstance.get(
        `/courses?sortBy=view:desc&limit=10&query=${courseName}`
      );
      console.log(coursesRes.data);
      const courseList = coursesRes.data.results.map((course) => {
        return courseCard(course);
      });
      console.log(courseList);
      const response1 = {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: courseList,
          },
        },
      };

      await callSendAPI(sender_psid, response1);
      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};

const handleGetSearchKey = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response1 = { text: `Type course name you want to find` };

      await callSendAPI(sender_psid, response1);
      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  handleGetStarted,
  handleGetCategory,
  handleGetCategoryCourse,
  handleGetSearchCourse,
  handleGetSearchKey,
};
