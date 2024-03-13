import request from "supertest";
import app from "../src/app";

const postOfferToTestMutations = async (token: string) => {
  const response = await request(app)
    .post("/graphql")
    .set("Authorization", `Bearer ${token}`)
    .send({
      query: `
        mutation {
          createOffer(input: {
            header: "Test Offer To Be Updated or Removed",
            text: "This is a test offer",
          }) {
            id
          }
        }
      `,
    });
  return response.body.data.createOffer.id;
}

export  { postOfferToTestMutations}
