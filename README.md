# Reference template for multiservice/microservice applications

**Built using [a-shine/api-gateway](https://github.com/a-shine/api-gateway) and
[a-shine/user-auth](https://github.com/a-shine/user-auth).**

## Abstract

This is a reference repository for a full-stack multiservice/microservice application and can be used as a template
when starting projects. An application constructed with a microservice architecture is composed of many backend
services which are all deployed together. The aim is to decouple the services from one another. In this repository,
each service is created in `backends/` and then added to the API gateway configuration under listed`services`. An API
gateway (reverse-proxy server) sits in front of all the backend services and handles routing to the correct service (as
well as a few other features such as authentication, rate limiting...), this means that all the backend services can be
interfaced with via a single host. The frontend server is a display service which provides users with a client-side
graphical interface. All the backend services are orchestrated with Docker Compose to facilitate local development.

## Architecture

![](https://raw.githubusercontent.com/a-shine/microservice-template/main/microservice-arch.drawio.svg)

In prose:

A request is made from a client (web app, public facing API) to the API gateway. If the request contains a valid JWT
token and the ID hasn't been blacklisted in the blacklist cache, it is then forwarded to the desired service as
determined by the URL path (configured in the `gateway.conf.yaml` file). If the token is invalid, expired or ID within
the token blacklisted, the request is unauthorized. The User management service, is a non-authenticated service as
users need to interact with it before being able to authenticate (to register, login...). If a user is suspended by an
admin, then his ID is added to the blacklist until his token expires, and he won't be able to log in and obtain a new
token until his account is reactivated.

When a user declares he wants to be deleted a user delete request published from the User management service to the
user-delete channel of the user cache. The Gateway listens for incoming messages containing the ID of the user to be
deleted. When a request is published, the Gateway will ask each authenticated service to delete user data by making a
request to the mandated `/user-delete` service route. Each service is then responsible for gracefully handling user data
deletion.

## Why a multiservice/microservice?

- **Non-uniform scaling** - The application services scale independently of one another, and we don't waste resources on
  services that are not in use. This allows for better use of available resources and cost optimization when deploying
  the application.
- **Separation of tasks** - Each service focuses on doing one thing and one thing well. A good practice for determining
  what is in scope for a service is if the service could be re-written in just a few days as apposed to the months and
  years needed to digest and re-writing a large monolithic codebase.
- **Decoupling services (minimizing dependencies)** - In a large monolithic application, every part of the application
  is dependent on every other part of the application as it is all coupled together. If a particular function panics the
  whole application becomes unavailable. In this architecture the gateway is a central point of failure, but each other
  service should be decoupled enabling them to fulfill their duty despite other services failing. This allows users to
  continue using the system, as long as they are not using the broken service but more importantly it also allows SREs
  to quickly identify problems.

## Design decisions log

In order to promote better design, having a log of design decisions and their respective justification formalizes each
decision and can enable more effective reasoning and robust design.

Example log of the design decisions for this repository:

- Fully orchestrated backend with Docker Compose to make life easier when developing. However, do not include the
  frontend server as while developing, it is easier to work with Node modules and typescript completion when the
  frontend code is not containerized. In addition, the frontend is just one service, so it is not difficult to manage
  the frontend server when developing.
- All the services (including the frontend) in one repository. This allows engineers to have visibility on the whole
  codebase and make more informed design decisions. In addition, it reduces the overhead and risk of poor dependency
  management.
- Custom reverse-proxy/API gateway to not be tied to a cloud provider.
- Infra-as-code to version control infrastructure and increase visibility on resources.
- Document each service locally within the service directory. This organically organizes the documentation and breaks
  down information into manageable chunks per service. In addition, a developer knows exactly where to look when working
  on a service.

## Getting started

### Backend development

#### Developing

One of the difficulties when working with microservices is that there are many moving parts that are required to make 
the app, as a whole, work. This can get in the way of development as even if many services are decoupled it is possible
to have dependencies on services such as a database. You could run each service locally on the machine in different 
shell sessions, but this can quickly become tedious, specially if the architecture has many services. This is where an
automated local orchestration tool can be of use.

An orchestration tool 'orchestrates' all the different services. It records their dependencies and allows them to 
communicate with each other. It is used to build all the components of the application and bring them up together. In 
addition, all the application logs are aggregated into one shell which can make debugging easier. An orchestration tool
such a Docker Compose, is geared towards development and makes it easy to orchestrate your services on a development 
machines.

From the root of the repository, build the services with:
```bash
docker compose build
 ```

Then, bring the whole application up with:
```bash
docker compose up
 ```

Interface with the services through the gateway with the`http://localhost:8000/[SERVICE_NAME][SERVICE_ROUTE]` or 
directly with the microservice `http://localhost:[SERVICE_DEV_PORT][SERVICE_ROUTE]`

Exit the session with `ctrl+c`

Finally, bring all the services down with:
```bash
```bash
docker compose down
```
Note that this will delete all the cached volumes, so development data will be lost.

#### Testing the API

You can use tools such as Postman or Insomnia with GUIs, but the simplest way is to just use the `cURL` program 
installed on most UNIX machines.

Registering a new user:
```bash
curl -v -H "Content-type: application/json" -d '{"password": "secret", "email":"bob@myemail.com", "first_name":"Bob", 
"last_name":"Smith"}' localhost:8000/user/register
```

Logging in:
```bash
curl -v -H "Content-type: application/json" -d '{"password": "secret", "email":"bob@myemail.com"}' localhost:8000/user/login
```

Any other request (that requires authentication):
```bash
curl -v --cookie "token=[TOKEN]" localhost:8000/[SERVICE_NAME]/[SERVICE_PATH]
```

Check authentication status with
```bash
curl -v --cookie "token=[TOKEN]" localhost:8000/isAuth
```

### Frontend development

From within the `frontend/` directory, run
```bash
npm install
```

Then, run
```bash
npm run dev
```

## Deploying in production

While microservice architectures have many benefits, they are trickier to work with both in development and production 
because of the need for orchestration and managing dependencies for each of the services.

While Docker Compose works well in the context of development it is limited to running each service on the same 
machine. This is where Kubernetes comes in - its core function is the same as for Docker Compose: orchestration, but is 
able to spread computation across a cluster of machines making it better suited to production.

You can generate the Kubernetes manifest files from the docker-compose.yml configuration
```bash
kompose convert -f compose-dev.yml -o ./orch/
```

But, you may find you want more control over the Kubernetes configuration. In this case, you will have to tweak them at
will.
