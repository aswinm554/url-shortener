const { nanoid } = require("nanoid")
const Url = require("../models/url.model")
const { sendSuccess, sendError } = require("../utils/response");
const redis = require("../config/redis");

const shortenUrl = async (req, res, next) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return sendError(res, "url required", 400)
    }
    const shortCode = nanoid(6);

    const url = await Url.create({
      originalUrl,
      shortCode,
      userId: req.user.id,
    });
    sendSuccess(res, { shortCode, originalUrl }, "short-url created", 201)

  } catch (error) {
    next(error);
  }
};

const redirectUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const cashed = await redis.get(shortCode);
    if (cashed) {
      res.redirect(cashed);                              // redirect user
      await Url.updateOne({ shortCode }, { $inc: { clicks: 1 } });  // background update
      return;                                            // then stop
    }
    const url = await Url.findOne({ shortCode });
    if (!url) {
      return sendError(res, "URL not found", 404);
    }
    await redis.set(shortCode, url.originalUrl, "EX", 3600);
    url.clicks += 1;
    await url.save();
    return res.redirect(url.originalUrl);
  } catch (error) {
    next(error);
  }
};

const getUrls = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const Urls = await Url.find({ userId });
    sendSuccess(res, Urls, "URLs fetched", 200);
  }
  catch (error) {
    next(error);
  }

};

const deleteUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const url = await Url.findOne({ shortCode });
    if (!url) {
      return sendError(res, "URL not found", 404);
    }
    if (url.userId.toString() !== req.user.id) {

      return sendError(res, "URL not match", 403);
    }
    await Url.findOneAndDelete({ shortCode });
    await redis.del(shortCode);
    sendSuccess(res, null, "URL deleted", 200);
  } catch (error) {
  next(error);
}

};
module.exports = { shortenUrl, redirectUrl, getUrls, deleteUrl };