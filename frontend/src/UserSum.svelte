<script lang="ts">
    import { onMount } from "svelte";
    import { replace } from "svelte-spa-router";

    let firstName;
    let lastName;
    let email;

    // Get user data from /me endpoint
    async function getUserData() {
        fetch("api/user/me")
            .then((res) => res.json())
            .then((data) => {
                firstName = data.firstName;
                lastName = data.lastName;
                email = data.email;
            });
    }

    // logout user
    async function logout() {
        const response = await fetch("api/user/logout", {
            method: "GET",
            credentials: "include",
        });
        if (response.ok) {
            replace("/");
        } else {
            console.log("not ok");
        }
    }

    onMount(() => {
        getUserData();
    });
</script>

<h3>{firstName} {lastName}</h3>
<h4>{email}</h4>

<button on:click={logout}>Logout</button>
