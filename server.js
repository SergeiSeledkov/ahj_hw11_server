const { faker } = require('@faker-js/faker');
const uuid = require('uuid');
const http = require("http");
const Koa = require('koa');
const app = new Koa();
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const Router = require('koa-router');
const router = new Router();
const PORT = process.env.PORT || 7070;
const server = http.createServer(app.callback());

app.use(koaBody({
	text: true,
	urlencoded: true,
	json: true,
	multipart: true,
}));

app.use(cors());

router.get('/messages/unread', (ctx) => {
	if (ctx.request.method === 'GET') {
		const arr = [];
		let i = 0;

		while (i < getRandomCount(2, 6)) {
			arr.push({
				id: uuid.v1(),
				from: faker.internet.email(),
				subject: faker.hacker.phrase(),
				body: faker.lorem.paragraph(),
				received: new Date()
			});

			i += 1;
		}

		ctx.response.body = {
			status: 'ok',
			timestamp: new Date(),
			messages: arr
		}
		ctx.response.status = 200;
	} else {
		ctx.response.body = 'Method Not Allowed (Allow: GET)';
		ctx.response.status = 405;
	}
});

function getRandomCount(min, max) {
	return Math.random() * (max - min) + min;
}

app.use(router.routes());
app.use(router.allowedMethods());

server.listen(PORT, () => console.log(`server started on ${PORT}`));