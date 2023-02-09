const label = {
  "400#email": {
    code: 404,
    error: ["email not found"],
  },
  "400#password": {
    code: 400,
    error: ["password not match"],
  },
  "409#login": {
    code: 409,
    error: ["has been login before"],
  },
  "401#notbasic": {
    code: 401,
    error: ["wrong authentication method"],
  },
  "404#device": {
    code: 404,
    error: ["device not found"],
  },
  "404#gateway": {
    code: 404,
    error: ["gateway not found"],
  },
  "409#device": {
    code: 409,
    error: ["duplicate device name"],
  },
  "409#gateway": {
    code: 409,
    error: ["duplicate gateway name"],
  },
  "404#devicevalue": {
    code: 404,
    error: ["no data"],
  },
};

export { label };
