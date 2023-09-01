const rateLimit = require("express-rate-limit");

// List to store temporarily blocked IPs
const blockedIPs = [];

// Middleware to check if IP is blocked
const isIPBlocked = (req, res, next) => {
  if (blockedIPs.includes(req.ip)) {
    return res.status(403).send("Your IP is temporarily blocked. Please wait.");
  }
  next();
};

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // Limit to 20 requests within 1 minute
  handler: function (req, res) {
    const ip = req.ip;
    if (!blockedIPs.includes(ip)) {
      blockedIPs.push(ip);

      // Unblock the IP after 1 minute
      setTimeout(() => {
        const index = blockedIPs.indexOf(ip);
        if (index > -1) {
          blockedIPs.splice(index, 1);
        }
      }, 1 * 60 * 1000); // 1 minute
    }
    res.status(429).send("Your IP has been temporarily blocked due to excessive requests. Please wait for a while.");
  },
});

const postlimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit to 20 requests within 1 minute
  handler: function (req, res) {
    const ip = req.ip;
    if (!blockedIPs.includes(ip)) {
      blockedIPs.push(ip);

      // Unblock the IP after 1 minute
      setTimeout(() => {
        const index = blockedIPs.indexOf(ip);
        if (index > -1) {
          blockedIPs.splice(index, 1);
        }
      }, 1 * 60 * 1000); // 1 minute
    }
    res.status(429).send("Your IP has been temporarily blocked due to excessive requests. Please wait for a while.");
  },
});


module.exports = {
  isIPBlocked,
  limiter,
  postlimiter
};
