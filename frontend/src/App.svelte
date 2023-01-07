<script lang="ts">
  import Router, { replace } from "svelte-spa-router";
  import wrap from "svelte-spa-router/wrap";
  import Hello from "./Hello.svelte";
  import Login from "./Login.svelte";
  import NotFound from "./NotFound.svelte";

  // isAuth is a function that returns a promise that resolves to a boolean
  // indicating whether the user is authenticated
  async function isAuth() {
    const response = await fetch("api/isAuth", {
      method: "GET",
      credentials: "include",
    });
    return response.ok;
  }

  async function isNotAuth() {
    const response = await fetch("api/isAuth", {
      method: "GET",
      credentials: "include",
    });
    return !response.ok;
  }

  // Handles the "conditionsFailed" event dispatched by the router when a component can't be loaded because one of its pre-condition failed
  function conditionsFailed(event) {
    switch (event.detail.route) {
      case "/":
        replace("/login");
        break;
      case "/login":
        replace("/");
        break;
      default:
        replace("/login");
        break;
    }
  }
</script>

<main>
  <!-- <nav> Do not relaod between switching pages -->
  <!-- <a href="/#">Home</a>
    <a href="/#/login">About</a>
    <a href="/#/blog/colors">Colors</a>
  </nav> -->
  <Router
    routes={{
      "/": wrap({
        component: Hello,
        conditions: [isAuth],
      }),
      "/login": wrap({
        component: Login,
        conditions: [isNotAuth],
      }),
      "*": NotFound,
    }}
    on:conditionsFailed={conditionsFailed}
  />
</main>

<style>
</style>
