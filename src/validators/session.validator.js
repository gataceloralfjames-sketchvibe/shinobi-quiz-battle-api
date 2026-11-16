const { body, param } = require('express-validator');

const idParam = param('id')
  .isInt({ min: 1 }).withMessage('id must be a positive whole number')
  .toInt();

const questionSetId = () => body('questionSetId')    // questionSetId INTEGER NOT NULL
  .exists().withMessage('questionSetId is required')
  .bail()
  .isInt({ min: 1 }).withMessage('questionSetId must be a positive whole number')
  .toInt();

const timeLimit = () => body('timeLimit')            // timeLimit INTEGER, optional
  .optional({ nullable: true })
  .isInt({ min: 1 }).withMessage('timeLimit must be a positive whole number')
  .toInt();

const joinCode = () => body('joinCode')              // joinCode VARCHAR(6) NOT NULL
  .exists().withMessage('joinCode is required')
  .bail()
  .isString().withMessage('joinCode must be text')
  .bail()
  .trim()
  .toUpperCase()
  .isLength({ min: 6, max: 6 }).withMessage('joinCode must be exactly 6 characters long')
  .bail()
  .matches(/^[A-Z0-9]+$/).withMessage('joinCode may only have letters and numbers');

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

// Join uses the code in the body. The user comes from the X-Demo-User header, not the body.
const joinRules = [joinCode(), nickname(), avatar()];

module.exports = { idParam, createRules, joinRules };