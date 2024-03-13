import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import CategoryModel from "../src/api/models/categoryModel";
import offerModel from "../src/api/models/offerModel";
import commentModel from "../src/api/models/commentModel";
import notificationModel from "../src/api/models/notificationModel";
import { postOfferToTestMutations } from "./offerFunctions";

describe("Mutations tests", () => {
  let token: string;
  let token2: string;
  let token3: string;
  let token4: string;

  const user = {
    id: "testUserId",
    username: "testUser",
    email: "testUser@example.com",
    role: "admin",
  };

  const anotherUser = {
    id: new mongoose.Types.ObjectId().toString(),
    username: "anotherTestUser",
    email: "anotherTestUser@example.com",
    role: "admin",
  };

  const anotherOneUser = {
    id: new mongoose.Types.ObjectId().toString(),
    username: "anotherOneTestUser",
    email: "anotherOneTestUser@example.com",
    role: "admin",
  };

  const userForOfferTests = {
    id: "65e1bca00f4e21cc652c8929",
    username: "admin user",
    email: "admin@null.com",
    role: "admin",
  }

  const userForOfferTests2 = {
    id: "65f07d06730d18865f5f1f03",
    username: "vera",
    email: "vera@vera.com",
    role: "user",
  }

  token = jwt.sign(user, <string>process.env.JWT_SECRET);

  token2 = jwt.sign(anotherUser, <string>process.env.JWT_SECRET);

  token3 = jwt.sign(userForOfferTests, <string>process.env.JWT_SECRET);

  token4 = jwt.sign(userForOfferTests2, <string>process.env.JWT_SECRET);

  beforeAll(async () => {
    await mongoose.connect(<string>process.env.DATABASE_URL2);

    const response = await request(app).post("/graphql").send({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a new category", async () => {
    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: `
          mutation {
            createCategory(name: "Test Category") {
              id
              name
            }
          }
        `,
      });
    const { data } = response.body;
    expect(data.createCategory.name).toBe("Test Category");
    const category = await CategoryModel.findOne({ name: "Test Category" });
    expect(category).not.toBeNull();
  });

  it("should update a category", async () => {
    const category = await CategoryModel.create({ name: "Old Category" });

    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: `
          mutation {
            updateCategory(id: "${category.id}", name: "New Category") {
              id
              name
            }
          }
        `,
      });

    const { data } = response.body;
    expect(data.updateCategory.name).toBe("New Category");
    const updatedCategory = await CategoryModel.findOne({
      name: "New Category",
    });
    expect(updatedCategory).not.toBeNull();
  });

  it("should delete a category", async () => {
    const category = await CategoryModel.create({ name: "Category to delete" });

    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: `
          mutation {
            deleteCategory(id: "${category.id}") {
              id
            }
          }
        `,
      });

    const { data } = response.body;
    expect(data.deleteCategory.id).toBe(category.id);
    const deletedCategory = await CategoryModel.findById(category.id);
    expect(deletedCategory).toBeNull();
  });

  it("should create a new comment", async () => {
    const postID = "65f0b32d38475ee76f4666bc";
    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token2}`)
      .send({
        query: `mutation { createComment(input: { text: "Test Comment", post: "${postID}" }) { id text } }`,
      });
    const { data } = response.body;
    expect(data.createComment.text).toBe("Test Comment");
    const comment = commentModel.findOne({ text: "Test Comment" });
    expect(comment).not.toBeNull();
  });

  it("should update a comment", async () => {
    const commentID = "65f2b877fec7e6e54debae91";
    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token2}`)
      .send({
        query: `mutation { updateComment(id: "${commentID}", input: { text: "Updated Comment" }) { id text } }`,
      });
    const { data } = response.body;
    expect(data.updateComment.text).toBe("Updated Comment");
    const updatedComment = await commentModel.findOne({
      text: "Updated Comment",
    });
    expect(updatedComment).not.toBeNull();
  });

  it("should delete a comment", async () => {
    const comment = await commentModel.create({
      text: "Comment to delete",
      author: anotherUser.id,
      publicationDate: new Date(),
    });
    const commentID = comment.id;
    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token2}`)
      .send({
        query: `mutation { deleteComment(id: "${commentID}") { id } }`,
      });
    const { data } = response.body;
    expect(data.deleteComment.id).toBe(commentID);
    const deletedComment = await commentModel.findById(commentID);
    expect(deletedComment).toBeNull();
  });

  it("should add a new notification", async () => {
    const response = await request(app)
      .post("/graphql")
      .send({
        query: `mutation {
          addNotification(input: {
            receiver: "${anotherUser.id}",
            text: "This is a test notification"
          }) {
            id
            text
            publicationDate
            expire
          }
        }`,
      });

    const { data } = response.body;
    expect(data.addNotification.text).toBe("This is a test notification");
    const notification = await notificationModel.findById(
      data.addNotification.id
    );
    expect(notification).not.toBeNull();
  });

  it("should send a notification to a single user", async () => {
    const userId = anotherUser.id;
    const text = "Test notification";

    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token2}`)
      .send({
        query: `
          mutation {
            sendNotificationToManyUsers(userIds: ["${userId}"], text: "${text}") {
              receiver {
                id
              }
              text
              publicationDate
              expire
            }
          }
        `,
      });
    const { data } = response.body;
    expect(data.sendNotificationToManyUsers).toHaveLength(1);
    const notification = await notificationModel.findOne({
      receiver: userId,
      text: text,
    });
    expect(notification).not.toBeNull();
  });

  it("should delete a notification", async () => {
    const notification = await notificationModel.create({
      receiver: anotherUser.id,
      text: "This is a test notification to delete",
      publicationDate: new Date(),
      expire: new Date(new Date().setDate(new Date().getDate() + 14)), // Set to expire in 14 days
    });

    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token2}`)
      .send({
        query: `
          mutation {
            deleteNotification(id: "${notification.id}") {
              id
              receiver {
                id
              }
              text
              publicationDate
              expire
            }
          }
        `,
      });
    const deletedNotification = await notificationModel.findById(
      notification.id
    );
    expect(deletedNotification).toBeNull();
  });

  it("should create a new offer", async () => {
    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token3}`)
      .send({
        query: `
          mutation {
            createOffer(input: {
              header: "Test Offer",
              text: "This is a test offer",
            }) {
              header
              text
            }
          }
        `,
      });
    const { data } = response.body;
    console.log(data);
    expect(data.createOffer.header).toBe("Test Offer");
    const offer = await offerModel.findOne({ header: "Test Offer" });
    expect(offer).not.toBeNull();
  });

  it("should not create an offer if not logged in", async () => {
    const response = await request(app)
      .post("/graphql")
      .send({
        query: `
          mutation {
            createOffer(input: {
              header: "Test Offer",
              text: "This is a test offer",
            }) {
              header
              text
            }
          }
        `,
      });
    const { errors } = response.body;
    console.log(errors);
    expect(errors[0].message).toBe("Failed to create offer");
  });

  it("should update an offer", async () => {
    const offerId = await postOfferToTestMutations(token3);
    console.log('offer id ', offerId);

    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token3}`)
      .send({
        query: `
          mutation {
            updateOffer(id: "${offerId}", input: {
              header: "Updated Offer",
              text: "This is an updated test offer",
            }) {
              header
              text
            }
          }
        `,
      });

    const { data } = response.body;
    expect(data.updateOffer.header).toBe("Updated Offer");
    const updatedOffer = await offerModel.findOne({ _id: `${offerId}`});
    expect(updatedOffer).not.toBeNull();
  });

  it("should not update an offer as a different user", async () => {
    const offerId = await postOfferToTestMutations(token3);

    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token4}`)
      .send({
        query: `
          mutation {
            updateOffer(id: "${offerId}", input: {
              header: "Updated Offer",
              text: "This is an updated test offer",
            }) {
              header
              text
            }
          }
        `,
      });

    const { errors } = response.body;
    console.log(errors);
    expect(errors[0].message).toBe("Failed to update offer");
  });

  it("should update an offer as an admin", async () => {
    const offerId = await postOfferToTestMutations(token4);

    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token3}`)
      .send({
        query: `
          mutation {
            updateOffer(id: "${offerId}", input: {
              header: "Updated Offer",
              text: "This is an updated test offer",
            }) {
              header
              text
            }
          }
        `,
      });
    const { data } = response.body;
    expect(data.updateOffer.header).toBe("Updated Offer");
    const updatedOffer = await offerModel.findOne({ _id: `${offerId}`});
    expect(updatedOffer).not.toBeNull();
  });

  it("should delete an offer", async () => {
    const offerId = await postOfferToTestMutations(token3);

    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token3}`)
      .send({
        query: `
          mutation {
            deleteOffer(id: "${offerId}") {
              header
              text
            }
          }
        `,
      });

    const { data } = response.body;
    expect(data.deleteOffer.header).toBe("Test Offer To Be Updated or Removed");
    const deletedOffer = await offerModel.findOne({ _id: `${offerId}` });
    expect(deletedOffer).toBeNull();
  });

  it("should not delete an offer as a different user", async () => {
    const offerId = await postOfferToTestMutations(token3);

    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token4}`)
      .send({
        query: `
          mutation {
            deleteOffer(id: "${offerId}") {
              header
              text
            }
          }
        `,
      });

    const { errors } = response.body;
    console.log(errors);
    expect(errors[0].message).toBe("Failed to delete offer");
  });

  it("should delete an offer as an admin", async () => {
    const offerId = await postOfferToTestMutations(token4);

    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token3}`)
      .send({
        query: `
          mutation {
            deleteOffer(id: "${offerId}") {
              header
              text
            }
          }
        `,
      });

    const { data } = response.body;
    expect(data.deleteOffer.header).toBe("Test Offer To Be Updated or Removed");
    const deletedOffer = await offerModel.findOne({ _id: `${offerId}` });
    expect(deletedOffer).toBeNull();
  });
});
