<script lang="ts">
    import { replace } from "svelte-spa-router";

    // make call to backend login endpoint
    async function onSubmit(event: Event) {
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const email = formData.get("email");
        const password = formData.get("password");
        const response = await fetch("api/user/signin", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            // credentials: "include",
        });
        if (response.ok) {
            // redirect to home page
            // window.location.href = "/";
            replace("/");
        } else {
            // show error message
            alert("Invalid username or password");
        }
    }
</script>

<!-- Login form -->
<h1>Login</h1>
<form on:submit|preventDefault={onSubmit}>
    <label for="email">Email</label>
    <input id="email" type="email" name="email" required />
    <label for="password">Password</label>
    <input id="password" type="password" name="password" required />
    <button type="submit">Login</button>
</form>

<style>
    /* Arrange inputs verically */
    form {
        display: flex;
        flex-direction: column;
        max-width: 300px;
    }
</style>
