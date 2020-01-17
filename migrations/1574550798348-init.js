/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: 'id',
    name: { type: 'text', notNull: true },
    email: { type: 'text', notNull: true }
  }, { ifNotExists: true })
  pgm.createTable('posts', {
    id: 'id',
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade'
    },
    name: { type: 'text', notNull: true }
  }, { ifNotExists: true })
  pgm.createIndex('posts', 'user_id', { ifNotExists: true })
}

exports.down = (pgm) => {
  pgm.dropTable('users', { cascade: true })
  pgm.dropTable('posts', { cascade: true })
}
