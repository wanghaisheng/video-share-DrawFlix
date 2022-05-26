import { v4 as uuid } from "uuid";
import { formatDate } from "../utils/authUtils";

export const users = [
  {
    _id: uuid(),
    fullName: "Jane Doe",
    email: "test@gmail.com",
    password: "tesT@123",
    createdAt: formatDate(),
    updatedAt: formatDate(),
  },
];
