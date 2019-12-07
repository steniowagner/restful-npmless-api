
## About this Project

The idea of the Project is:

"Build a simple RESTful API using just native node-js modules".

## Why?

I've been using express for routing and mongoose/sequelize to connect my server with my database for a while, and just wanted to try to build my own router and my own database-connector and use them to build a RESTful API using just native modules. 🤷🏾‍♂️ 

Also, this project is part of my personal portfolio, so, I'll be happy if you could provide me any feedback about the project, code, structure or anything that you can report that could make me a better developer!

Email-me: stenio.wagner1@gmail.com

Connect with me at [LinkedIn](https://www.linkedin.com/in/steniowagner/).

You can use this Project as you wish, be for study, be for make improvements or earn money with it!

It's free!

## Some notes about this Project

1 - This project isn't intended to be running on production mode, so, it's simple and isn't perfect, but it was simply an amazing experience  build it ❤. 

2 - You'll see some traces of express on the routes definitions and mongoose/sequelize on the schema definitions, so, if you already used one of these tools you'll be at home 😊.

3 - If you already built a RESTful API before, you'll see that the API insinde the /src is very simple, but everything inside of this folder is the implementation of my custom-router and custom-model that you can find on /server folder. 

4 - The magic happens inside the /server folder, there you'll find schema-validation, routing using middleware pattern, populate fields and many more! 

5 - The database will be just .JSON files.

6 - And I'll answer you: And I answer you: I know we don't always have time to implement our own ideas to solve certain problems that we face in our daily lives as engineers who use programming to create solutions, but I really want to encourage you, whenever possible, to try to build your own solutions and codify your ideas for these problems, this will make you a much more independent developer and of course much more confident in using a programming language. Apart from the fact that of course this experience will make you expand your knowledge and make you feel amazing while implementing each feature (as I'm feeling now)!

PS: Treat this project as a personal challenge that I set myself, so there is no intention of running this API in production. Therefore, this project is not a perfect solution and certainly not better than the ones that already exist in the market, but I want to share this knowledge I learned and implemented with the community so that everyone can benefit from what I did!

## What's inside

There was 5 prerequisites settled by me for this project that had to be implemented (And I built them all! 🤩 How cool is that?!)

### 1 - File updates
Did you ever used nodemon? If you don't, nodemon is basically a tool that restarts your server everytime that you update some file inside a certain directory.  I really love this tool (it makes our lives so easy, right?), but, since I was using just native modules, I needed to create my own version of the nodemon. So, everytime that I change something, the server is restarted with the new code! You can take a look on the code of this feature on the [watcher file](https://github.com/steniowagner/restful-npmless-api/blob/master/watcher.js).

PS: This watcher just watch the /src or /server directory, so, if you want to see the changes of some directory, just change the name of the directory on the line 4 to 'src' or 'server'. But you can also create an outer folder that would wrap up everything, and then you'll just need to watch a single folder!

### 2 - Auth
I built a simple login/logout and authorization/authentication to simulate what we see in the real world. To simulate sessions, I created tokens to control the access of the routes. So, everytime that you want to acess  some route, you'll need to provide the token (provided by the server when you log-in) and the user_id (the id of the user that want to acess the route) inside the Header of the request.

You can take a look on the [Auth middleware](https://github.com/steniowagner/restful-npmless-api/blob/master/src/middlewares/auth.js) and on the [Token schema](https://github.com/steniowagner/restful-npmless-api/blob/master/src/models/Token.js) to better understading.

### 3 - Routing

I really love express, really like the flexibility and the freedom that it gives to the developer to define routes. The express uses a pattern called Middleware (or Pipeline), that makes possible to declare a route and a chain of methods that will be called when this route (attached with some HTTP method) is accessed.

So, I built my own simple version of express. I just did the enough to receive some route and attached it with some HTTP method and define a pipeline of methods that should be called when this route has been called (as express does!).

Also, the Router some additional features:

- Get the params inside the request's URL, for example:
	> On the route definition: `/books/#id`
	
	> On the request's URL: `/books/123`
	
	The router will store inside the `req.params` a field called `id` with the value `123` as express does.
	Take a look on [getRequestParams](https://github.com/steniowagner/restful-npmless-api/blob/master/server/router/utils/getRequestParams.js) to see the implementation.

- Parse the HTTP method, route path and query-string-params of the request. This parser is defined on the [parseRequest](https://github.com/steniowagner/restful-npmless-api/blob/master/server/router/utils/parseRequest.js) file.
- Parse the request's payload that is the content inside the *body* of the request. You can see the implementation of this method [here](https://github.com/steniowagner/restful-npmless-api/blob/master/server/router/utils/parseRequestPayload.js).

- Add middlewares and chain the pipeline of execution of a certain route with certain HTTP method: [addMiddlewares](https://github.com/steniowagner/restful-npmless-api/blob/master/server/router/index.js#L33).

For the matter of simplicity, I just defined the GET, POST, PUT and DELETE HTTP methods handlers, and there's no implementation to do any kind of splitting on the pipelines definition.

The Router also has a method called [process](https://github.com/steniowagner/restful-npmless-api/blob/master/server/router/index.js#L61) that is responsible to process the current request and call the pipeline that matches with the route and the HTTP method of the request. 


### 4 - Models

I didn't want just have the Database, I wanted to define schemas, validate the inputs with these schemas before save/update something on the Database, check unique fields, populate data, paginate, define data-types...

That's why I created my own [Schema Model](https://github.com/steniowagner/restful-npmless-api/blob/master/server/model/Model.js) that will provide the:

- Schema definition
- Validate the input data based on the pre-defined Schema: [validateSchema](https://github.com/steniowagner/restful-npmless-api/blob/master/server/model/utils/validateSchema.js).
- Check if a unique field already exists on the database: [checkUniqueFields](https://github.com/steniowagner/restful-npmless-api/blob/master/server/model/utils/checkUniqueFields.js).
- Filter based on the query-params: [filterItemsWithQueryParams](https://github.com/steniowagner/restful-npmless-api/blob/master/server/model/utils/filterItemsWithQueryParams.js).
- Paginate items: [paginateItems](https://github.com/steniowagner/restful-npmless-api/blob/master/server/model/utils/paginateItems.js).
- Populate data: [populate](https://github.com/steniowagner/restful-npmless-api/blob/master/server/model/utils/populate.js).
> PS: This populate method only populates objects or arrays of the type ID, it doesn't populate arrays of objects that contains fields of the type ID. I didn't want to implement this feature to make possible to someone else contribute with the project! Feel free to implement this feature and open a PR!


And also provides the methods that will make possible the route controllers interact with the database:

- [create](https://github.com/steniowagner/restful-npmless-api/blob/master/server/model/Model.js#L37(https://github.com/steniowagner/restful-npmless-api/blob/master/server/model/Model.js#L37)): Create a new register on the Database.

- [findAll](https://github.com/steniowagner/restful-npmless-api/blob/master/server/model/Model.js#L53(https://github.com/steniowagner/restful-npmless-api/blob/master/server/model/Model.js#L53)): Find all register that matches with the params provided.

- [findOne](https://github.com/steniowagner/restful-npmless-api/blob/master/server/model/Model.js#L78(https://github.com/steniowagner/restful-npmless-api/blob/master/server/model/Model.js#L78)): Find one register based on the ID provided.

- [findOneAndUpdate](https://github.com/steniowagner/restful-npmless-api/blob/master/server/model/Model.js#L96): Find one register based on the ID and update it with the values provided.

- [findOneAndRemove](https://github.com/steniowagner/restful-npmless-api/blob/master/server/model/Model.js#L123): Find one register based on the ID and delete it.

### 5 - Database

For this project, I built a database based on files, so, every entity on the application will have a folder with its files inside with the .json extension. The name of the folder is defined when you define your schema ([for example](https://github.com/steniowagner/restful-npmless-api/blob/master/src/models/Book.js)) with the `collection` field.

All the I/O operations are defined by the [read](https://github.com/steniowagner/restful-npmless-api/blob/master/server/model/io/read.js) and [write](https://github.com/steniowagner/restful-npmless-api/blob/master/server/model/io/write.js) methods.

## The example API

Now that you already know what's inside of this project, let me introduce you the API that I built using the project:

The context of the example API is a Library, where you have Users, Authors, Books and a general module to manage the library.

With this Example API you can:
- CRUD of Books
- CRUD of Authors
- CRUD of Users
- Borrow/Deilvier a Book
- Enter in the Waiting Queue for a Book
 
You can check it out all the Models created on the example API [here](https://github.com/steniowagner/restful-npmless-api/tree/master/src/models), the Controllers [here](https://github.com/steniowagner/restful-npmless-api/tree/master/src/controllers), and all the Routes as well as Server definition [here](https://github.com/steniowagner/restful-npmless-api/blob/master/src/server.js).

## Running the Example API

Since this project doesn't depend on any external dependency, you can just run and start to use it!

**Cloning the repository**

```
$ git clone https://github.com/steniowagner/restful-npmless-api

$ cd restful-npmless-api
```

**Running**

> Note: This project wasn't tested on Windows, so, maybe you find some bugs if you're trying to run it on Windows OS.

```
$ node index.js
```

Now, if you try to access the test route on your HTTP client (Postman/Insomnia...):

GET - http://localhost:3000/

You should see a welcome message: 'UHUL! The API is Up && Running!!!' 

> The Base URL is: http://localhost:3000/

Now that you have the example API running on your machine, let's do the following:

* 1 - Acess the POST - /signup route and provide the [required fields to create an user](https://github.com/steniowagner/restful-npmless-api/blob/master/src/models/User.js) (name, username, e-mail, password and role - for this example, choose the *ADMIN* role). You'll receive the ID of this new user.

![signup](https://github.com/steniowagner/restful-npmless-api/blob/master/imgs/Screen%20Shot%202019-12-06%20at%2001.40.30.png)

* 2 - Now, login with the account that you created on the previous step by accessing the POST - /login route and providing the username and password of your account **inside of the body of the request**. You'll receive the id of a token created especifically to your user.

![login](https://github.com/steniowagner/restful-npmless-api/blob/master/imgs/Screen%20Shot%202019-12-06%20at%2001.40.49.png)

> If you take a look on the root folder of the project, you should have a folder called database created with the Tokens and Users folders inside of it.

* 3 - To access the routes, you'll need to especify your id and your token inside the request's header:

![user-id-with-token-request-header](https://github.com/steniowagner/restful-npmless-api/blob/master/imgs/Screen%20Shot%202019-12-06%20at%2001.31.46.png)
Always pay attention when you're trying to access some route that is creating, updating or deleting something, these routes will always require that you need to be an ADMIN to access them.

Now that you already know how to signup and loggin in the API, you can play and explore the othe routes!


## Contributing

You can send how many PR's do you want, I'll be glad to analyse and accept them! And if you have any question about the project...

Email-me: stenio.wagner1@gmail.com

Connect with me at [LinkedIn](https://www.linkedin.com/in/steniowagner/)

Thank you!
