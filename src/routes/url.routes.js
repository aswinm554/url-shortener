const express = require("express");
const router = express.Router();
const { shortenUrl, redirectUrl, getUrls, deleteUrl } = require("../controllers/url.controller");
const { auth } = require("../middleware/auth.middleware");
const { apiLimiter } = require("../middleware/rateLimit.middleware");
const { validateUrl } = require("../middleware/validate.middleware");

/**
 * @swagger
 * /url/shorten:
 *   post:
 *     summary: Shorten a URL
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - originalUrl
 *             properties:
 *               originalUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Short URL created
 *       400:
 *         description: Invalid URL
 */
router.post("/shorten", auth, validateUrl, apiLimiter, shortenUrl);

/**
 * @swagger
 * /url/{shortCode}:
 *   get:
 *     summary: Redirect to original URL
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect to original URL
 *       404:
 *         description: URL not found
 */
router.get("/:shortCode", apiLimiter, redirectUrl);

/**
 * @swagger
 * /url/:
 *   get:
 *     summary: Get all URLs for logged in user
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: URLs fetched successfully
 */
router.get("/", auth, apiLimiter, getUrls);

/**
 * @swagger
 * /url/{shortCode}:
 *   delete:
 *     summary: Delete a URL
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: URL deleted successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: URL not found
 */
router.delete("/:shortCode", auth, apiLimiter, deleteUrl);

module.exports = router;