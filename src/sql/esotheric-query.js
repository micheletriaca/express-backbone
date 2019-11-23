module.exports = {
  '/user-with-posts/:id': [
    `WITH u_con_p AS (SELECT
      id,
      name,
      email,
      COALESCE((SELECT json_agg(json_build_object(
        'code', p.id,
        'name', p.name
      )) FROM posts p WHERE p.user_id = u.id), '[]') AS posts
      FROM users u
    )
    SELECT json_build_object(
      'level2', json_build_object(
        'anotherLevelYet', json_agg(row_to_json(u_con_p))
      )
    ) as level1
    FROM u_con_p WHERE u_con_p.id = $1`,
    null,
    req => [req.myParams.id]
  ]
}
