import jwt from "jsonwebtoken";

const authTokenGenerator = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
};

export default authTokenGenerator;
