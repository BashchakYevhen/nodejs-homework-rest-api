## GoIT Node.js Course Template Homework

### Команди:

- `npm start` &mdash; старт сервера в режимі production
- `npm run start:dev` &mdash; старт сервера в режимі розробки (development)
- `npm run lint` &mdash; запустити виконання перевірки коду з eslint, необхідно виконувати перед кожним PR та виправляти всі помилки лінтера
- `npm lint:fix` &mdash; та ж перевірка лінтера, але з автоматичними виправленнями простих помилок

### endpoint:

GET: localhost:3000/api/contacts;

POST: localhost:3000/api/contacts
body{  
 "name": "string",
"email": "email",
"phone": "(542) 451-1111",
"favorite": false
};

PATCH: localhost:3000/api/contacts/:id
body{
"name": "string",
"email": "email",
"phone": "(542) 451-1111",
"favorite": false
};

DEL: localhost:3000/api/contacts/:id;

POST: localhost:3000/api/user/register
body{
"email": "email",
"password": "min-6",
};

POST: localhost:3000/api/user/login
body{
"email": "email",
"password": "min-6",
};

POST: localhost:3000/api/user/logout - JWT;

GET: localhost:3000/api/user/current - JWT;
 
PATCH: localhost:3000/api/user/avatars - JWT + body:{ image };

POST: localhost:3000/api/user/verify - body:{ email };

POST: localhost:3000/api/user/verify/:verificationToken;
