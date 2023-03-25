db.createUser({
  user: "user",
  pwd: "pass",
  roles: [{ role: "readWrite", db: "cluster0" }],
  passwordDigestor: "server",
});
