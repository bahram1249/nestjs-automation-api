export function fromCookie(cookieName) {
  return function (request) {
    var token = null;
    if (request.cookies[cookieName]) {
      token = request.cookies[cookieName];
    }
    return token;
  };
}
