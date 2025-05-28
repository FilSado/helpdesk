const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');

const app = new Koa();

app.use(cors({
  origin: 'http://localhost:8080' // Разрешаем фронтенду на порту 8080
}));

app.use(bodyParser());

let tickets = [
  {
    id: 1,
    name: 'Проблема с VPN',
    status: false,
    created: Date.now(),
    description: 'Не подключается к корпоративной сети',
  },
  {
    id: 2,
    name: 'Сломалась мышь',
    status: true,
    created: Date.now(),
    description: 'Перестала работать левая кнопка',
  },
  {
    id: 3,
    name: 'Ошибка в приложении',
    status: false,
    created: Date.now(),
    description: 'Приложение крашится при запуске',
  },
];

app.use(async (ctx) => {
  const { method, id } = ctx.query;

  if (ctx.method === 'GET') {
    switch (method) {
      case 'allTickets':
        ctx.body = tickets.map(({ description, ...rest }) => rest);
        return;

      case 'ticketById':
        const ticketId = parseInt(id);
        const ticket = tickets.find((t) => t.id === ticketId);
        if (ticket) {
          ctx.body = ticket;
        } else {
          ctx.status = 404;
          ctx.body = { error: 'Ticket not found' };
        }
        return;

      default:
        ctx.status = 400;
        ctx.body = { error: 'Invalid method' };
        return;
    }
  } else if (ctx.method === 'POST') {
    if (method === 'createTicket') {
      const { name, description, status } = ctx.request.body;

      // Исправлено условие: должно быть логическое И (&&), а не пробел
      if (!name || !description) {
        ctx.status = 400;
        ctx.body = { error: 'Name and description are required' };
        return;
      }

      const newTicket = {
        id: Date.now(),
        name,
        status: Boolean(status),
        created: Date.now(),
        description,
      };
      tickets.push(newTicket);
      ctx.body = newTicket;
      return;
    } else {
      ctx.status = 400;
      ctx.body = { error: 'Invalid method for POST' };
      return;
    }
  } else {
    ctx.status = 405;
    ctx.body = { error: 'Method not allowed' };
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);  // Обязательно обратные кавычки
});
