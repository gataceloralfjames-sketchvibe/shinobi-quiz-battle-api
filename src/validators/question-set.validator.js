const { body, param } = require('express-validator');

const idParam = param('id')
  .isInt({ min: 1 }).withMessage('id must be a positive whole number')
  .toInt();

const title = () => body('title')                    // title VARCHAR(100) NOT NULL
  .exists().withMessage('title is required')
  .bail()
  .isString().withMessage('title must be text')
  .bail()
  .trim()
  .isLength({ min: 3, max: 100 }).withMessage('title must be 3 to 100 characters long');

const subject = () => body('subject')                // subject VARCHAR(100) NOT NULL
  .exists().withMessage('subject is required')
  .bail()
  .isString().withMessage('subject must be text')
  .bail()
  .trim()
  .isLength({ min: 1, max: 100 }).withMessage('subject must be 1 to 100 characters long');

const createRules = [title(), subject()];

// PATCH changes only what is sent, but at least one field must be sent.
const updateRules = [
  idParam,
  title().optional(),
  subject().optional(),
  body().custom((value) => {
    const sent = Object.keys(value || {});
    if (!sent.some((key) => ['title', 'subject'].includes(key))) {
      throw new Error('send at least one of: title, subject');
    }
    return true;
  }),
];

module.exports = { idParam, createRules, updateRules };