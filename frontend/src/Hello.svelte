<script lang="ts">
    import { onMount } from "svelte";
    import Modal from "./lib/Modal.svelte";
    import UserSum from "./UserSum.svelte";

    let userData;
    let showModal = false;

    onMount(async () => {
        const response = await fetch("api/hello/", {
            method: "GET",
            credentials: "include",
        });
        if (response.ok) {
            const data = await response.json();
            userData = data.message;
        } else {
            console.log("not ok");
        }
    });
</script>

<button on:click={() => (showModal = true)}> Email/Name </button>

<h1>{userData}</h1>

{#if showModal}
    <Modal on:close={() => (showModal = false)}>
        <UserSum />
    </Modal>
{/if}
