const db = require('../../data/db-config.js')

module.exports = {
  findPosts,
  find,
  findById,
  add,
  remove
}



//MOCK THESE OUT IN SQL FIRST TO FIND OUT 
//HOW TO GET IT ALL TO WORK

//IF YOU CANT ACCESS SOMETHING SOMETIMES MAYBE TRY
//USING A DIFFERENT KIND OF JOIN


async function findPosts(user_id) {

  const rows = await db('posts as p')
    .select('p.id as post_id', 'contents', 'username')
    .join('users as u', 'p.user_id', '=', 'u.id')
    .where('u.id', user_id)

    return rows

  /* 
  select
    p.id as post_id,
    contents,
    username
    from posts as p  <<<THE POSTS IS CLOSER TO THE 'from' SO IT IS THE LEFT CENTERED TABLE
    join users as u
      on p.user_id = u.id
    where u.id = 3;
    
    THIS ABOUT IS THE RAW SQLlite ABOVE YOU ARE JUST WRITING IT IN 
    KNEX USING THE RAW SQL.
    YOU MAY WANT TO BE 
  
  
  */


  /*
    Implement so it resolves this structure:

    [
      {
          "post_id": 10,
          "contents": "Trusting everyone is...",
          "username": "seneca"
      },
      etc
    ]
  */
}

async function find() {
  
  const rows = await db('users as u')//<<<<put the table you want to be the left one here
    .leftJoin('posts as p', 'u.id', '=', 'p.user_id') //<<< need to use a leftJoin instead of just a join
    //becuase otherwise the philosopher without any posts would not be found
    .count('p.id as post_count')
    .groupBy('u.id')
    .select('u.id as user_id', 'username')

    return rows



  /*
  
  select
    u.id as user_id,
    username,
    count(p.id) as post_count
  from users as u
  left join posts as p
    on u.id = p.user_id
  group by u.id;
  
  */



  /*
    Improve so it resolves this structure:

    [
        {
            "user_id": 1,
            "username": "lao_tzu",
            "post_count": 6
        },
        {
            "user_id": 2,
            "username": "socrates",
            "post_count": 3
        },
        etc
    ]
  */
}

async function findById(id) {
  
  const rows = await db('users as u')
    .leftJoin('posts as p', 'u.id', 'p.user_id')
    .select('u.id as user_id', 'username', 'contents', 'p.id as post_id')
    .where('u.id', id)

    let result = rows.reduce((acc, row) => {
      if (row.contents) {
        acc.posts.push({contents: row.contents, post_id: row.post_id})
      }

      return acc

    }, { user_id: rows[0].user_id, username: row[0].username, posts: [] }) //<<< learn about accumlulatorss 
    //and here we are using raw JS to change things to make it
    //the shape that we wanted


    return result
  /*
  select
    u.id as user_id
    username,
    contents,
    p.id as post_id
  from users as u
  left join posts as p
    u.id = p.user_id
  where u.id = 1;    
  */

  /*
    Improve so it resolves this structure:

    {
      "user_id": 2,
      "username": "socrates"
      "posts": [
        {
          "post_id": 7,
          "contents": "Beware of the barrenness of a busy life."
        },
        etc
      ]
    }
  */
}

function add(user) {
  return db('users')
    .insert(user)
    .then(([id]) => { // eslint-disable-line
      return findById(id)
    })
}

function remove(id) {
  // returns removed count
  return db('users').where({ id }).del()
}
