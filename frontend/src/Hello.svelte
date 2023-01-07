<script lang="ts">
    import { onMount } from "svelte";

    let userData;

    onMount(async () => {
        const response = await fetch("api/hello/", {
            method: "GET",
            credentials: "include",
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            userData = data.message;
        } else {
            console.log("not ok");
        }
    });
</script>

<h1>{userData}</h1>
