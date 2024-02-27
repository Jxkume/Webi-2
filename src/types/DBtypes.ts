import { Document, Types } from "mongoose";

type User = Partial<Document> & {
  id: Types.ObjectId | string;
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
};

type Category = Partial<Document> & {
  id: Types.ObjectId | string;
  name: string;
};

type Review = Partial<Document> & {
  id: Types.ObjectId | string;
  author: User | Types.ObjectId;
  category: Category | Types.ObjectId;
  header: string;
  text: string;
  filename: string;
  publicationDate: Date;
  rating: 1 | 2 | 3 | 4 | 5;
};

type Comment = Partial<Document> & {
  id: Types.ObjectId | string;
  author: User | Types.ObjectId;
  text: string;
  publicationDate: Date;
  post: Offer | Review | Types.ObjectId;
  onModel: "Offer" | "Review";
};

type Offer = Partial<Document> & {
  id: Types.ObjectId | string;
  author: User | Types.ObjectId;
  category: Category | Types.ObjectId;
  header: string;
  text: string;
  publicationDate: Date;
  deletionDate: Date;
};

export { User, Category, Review, Comment, Offer };
