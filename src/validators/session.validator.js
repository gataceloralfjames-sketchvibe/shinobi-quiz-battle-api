 const { body, param } = require('express-validator');

// The join code is in the URL, not the id: six letters or numbers, made uppercase.
const codeParam = () => param('code')
  .trim()
  .toUpperCase()
  .matches(/^[A-Z0-9]{6}$/).withMessage('the join code must be exactly 6 letters or numbers');

const questionSetId = () => body('questionSetId')    // questionSetId INTEGER NOT NULL
  .exists().withMessage('questionSetId is required')
  .bail()
  .isInt({ min: 1 }).withMessage('questionSetId must be a positive whole number')
  .toInt();

const timeLimit = () => body('timeLimit')            // timeLimit INTEGER, optional
  .optional({ nullable: true })
  .isInt({ min: 1 }).withMessage('timeLimit must be a positive whole number')
  .toInt();

// A client may only ask for these two values. The service decides if the change is allowed.
const status = () => body('status')
  .exists().withMessage('status is required')
  .bail()
  .isIn(['active', 'finished']).withMessage('status must be active or finished');

const nickname = () => body('nickname')              // nickname VARCHAR NOT NULL
  .exists().withMessage('nickname is required')
  .bail()
  .isString().withMessage('nickname must be text')
  .bail()
  .trim()
  .isLength({ min: 2, max: 30 }).withMessage('nickname must be 2 to 30 characters long');

const avatar = () => body('avatar')                  // avatar VARCHAR, optional
  .optional({ nullable: true })
  .isString().withMessage('avatar must be text')
  .bail()
  .trim()
  .isLength({ max: 255 }).withMessage('avatar must be at most 255 characters long');

const createRules = [questionSetId(), timeLimit()];

// For routes that only need the code (GET /:code, GET /:code/players).
const codeRules = [codeParam()];

// PATCH /:code
const statusRules = [codeParam(), status()];

// POST /:code/players. The code comes from the URL; the user comes from the X-Demo-User header.
const joinRules = [codeParam(), nickname(), avatar()];

module.exports = { codeRules, createRules, statusRules, joinRules };