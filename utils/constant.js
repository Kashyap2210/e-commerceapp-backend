const Role = Object.freeze({
  ADMIN: "admin",
  USER: "user",
});

const Status = Object.freeze({
  NEW: "new",
  SHIPPED: "shipped",
  FULFILLED: "fulfilled",
});

module.exports = { Role, Status };
