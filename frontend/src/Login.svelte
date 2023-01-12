<script lang="ts">
    import { replace } from "svelte-spa-router";

    let errorMessage: string;

    // make call to backend login endpoint
    async function onSubmit(event: Event) {
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const email = formData.get("email");
        const password = formData.get("password");
        const response = await fetch("api/user/login", {
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
            const data = await response.json();
            errorMessage = data.message;
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
    <hr />
    <button type="submit">Login</button>
</form>

<!-- if errorMessage display -->
{#if errorMessage}
    <p>{errorMessage}</p>
{/if}

<style>
    /* Arrange inputs verically */
    form {
        display: flex;
        flex-direction: column;
        max-width: 300px;
    }

    /* add space between inputs and submit button inside form */
</style>
