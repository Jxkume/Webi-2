import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import CategoryModel from "../src/api/models/categoryModel";
import commentModel from "../src/api/models/commentModel";
import notificationModel from "../src/api/models/notificationModel";
import reviewModel from "../src/api/models/reviewModel";
import { isLoggedIn } from "../src/functions/authorize";

describe("Mutations tests", () => {
  let token: string;
  let token2: string;

  const user = {
    id: new mongoose.Types.ObjectId().toString(),
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

  const categoryTestID = "65e3174757f0cfbcc5f4ee50";

  const postTestID = "65f0b32d38475ee76f4666bc";

  const commentTestID = "65f2b877fec7e6e54debae91";

  const reviewTestID = "65f0b32d38475ee76f4666bc";

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
    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token2}`)
      .send({
        query: `mutation { createComment(input: { text: "Test Comment", post: "${postTestID}" }) { id text } }`,
      });
    const { data } = response.body;
    expect(data.createComment.text).toBe("Test Comment");
    const comment = commentModel.findOne({ text: "Test Comment" });
    expect(comment).not.toBeNull();
  });

  it("should update a comment", async () => {
    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token2}`)
      .send({
        query: `mutation { updateComment(id: "${commentTestID}", input: { text: "Updated Comment" }) { id text } }`,
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
      expire: new Date(new Date().setDate(new Date().getDate() + 14)),
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

  it("should add a review", async () => {
    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token2}`)
      .send({
        query: `
          mutation {
            addReview(input: { header: "Test review", text: "This is a test review", rating: 5, category: "${categoryTestID}", filename: "test.jpg"}) {
              id
              header
              text
              rating
              category {
                id
              }
            }
          }
        `,
      });
    const { data } = response.body;
    expect(data.addReview.header).toBe("Test review");
    expect(data.addReview.text).toBe("This is a test review");
    expect(data.addReview.rating).toBe(5);
    expect(data.addReview.category.id).toBe(categoryTestID);
    const review = reviewModel.findOne({ text: "This is a test review" });
    expect(review).not.toBeNull();
  });

  it("should update a review", async () => {
    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token2}`)
      .send({
        query: `
          mutation {
            updateReview(id: "${reviewTestID}", input: { header: "Updated review", text: "This is an updated review", rating: 4 }) {
              id
              header
              text
              rating
            }
          }
        `,
      });

    const { data } = response.body;
    expect(data.updateReview.id).toBe(reviewTestID);
    expect(data.updateReview.header).toBe("Updated review");
    expect(data.updateReview.text).toBe("This is an updated review");
    expect(data.updateReview.rating).toBe(4);

    const updatedReview = await reviewModel.findOne({
      text: "This is an updated review",
    });
    expect(updatedReview).not.toBeNull();
  });

  it("should delete a review", async () => {
    const reviewTest = await reviewModel.create({
      header: "Test Review",
      text: "This is a test review that should be deleted.",
      rating: 5,
      author: anotherUser.id,
      category: categoryTestID,
      publicationDate: new Date(),
    });
    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token2}`)
      .send({
        query: `
          mutation {
            deleteReview(id: "${reviewTest.id}") {
              id
            }
          }
        `,
      });

    const deletedReview = await reviewModel.findById(reviewTest.id);
    expect(deletedReview).toBeNull();
  });

  it("should login a user", async () => {
    const response = await request(app)
      .post("/graphql")
      .send({
        query: `
          mutation {
            login(credentials: { username: "testuser", password: "testpassword" }) {
              token
              user {
                id
                username
              }
            }
          }
        `,
      });
    expect(isLoggedIn);
  });

  it("should register a user", async () => {
    const response = await request(app)
      .post("/graphql")
      .send({
        query: `
          mutation {
            register(user: { username: "newuser", password: "newpassword", email: "newuser@test.com" }) {
              user {
                id
                username
                email
              }
            }
          }
        `,
      });

    const { data } = response.body;
    expect(data.register.user.username).toBe("newuser");
    expect(data.register.user.email).toBe("newuser@test.com");
  });

  it("should add a category to a user", async () => {
    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: `
          mutation {
            addCategoryToUser(categoryId: "${categoryTestID}") {
              id
              username
              isFollowing {
                id
              }
            }
          }
        `,
      });

    const { data } = response.body;
    if (!data.addCategoryToUser) {
      console.log(response.body);
    }
    expect(data.addCategoryToUser.isFollowing).toContainEqual({
      id: categoryTestID,
    });
  });
});
