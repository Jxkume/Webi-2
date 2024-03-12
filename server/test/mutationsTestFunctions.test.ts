import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import CategoryModel from "../src/api/models/categoryModel";
import commentModel from "../src/api/models/commentModel";
import notificationModel from "../src/api/models/notificationModel";

describe("Mutations tests", () => {
  let token: string;
  let token2: string;

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

  token = jwt.sign(user, <string>process.env.JWT_SECRET);

  token2 = jwt.sign(anotherUser, <string>process.env.JWT_SECRET);

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
});
