const sql = require('sql-template-strings')

module.exports = {
  '/user-with-posts/:id': ({ myParams }) => [
    sql`SELECT
      json_build_object('level2', json_build_object('anotherlevelyet', row_to_json(u_con_p))) level1
      FROM (SELECT
        id,
        name,
        email,
        coalesce((SELECT
          json_agg(json_build_object(
            'code', p.id,
            'label', p.name
          ))
          FROM posts p
          WHERE p.user_id = u.id
        ), '[]') posts
        FROM users u WHERE id = ${myParams.id}
      ) u_con_p`
  ]
}
