import { body } from 'express-validator'

export const createPostValidator = [
  body('content')
    .optional()
    .isString().withMessage('Content must be a string')
    .isLength({ max: 280 }).withMessage('Content must be at most 280 characters'),
  body('repostFrom')
    .optional()
    .isMongoId().withMessage('Invalid repost post ID'),
]