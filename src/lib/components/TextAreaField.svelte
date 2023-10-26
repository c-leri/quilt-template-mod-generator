<script lang="ts">
	import type { Writable } from 'svelte/store';

	export let label: string;
	export let placeholder: string;
	export let help: string | undefined = undefined;
	export let value: Writable<string>;

	const id = crypto.randomUUID();
</script>

<div class="field">
	<label for={id} class="label is-medium">{label}</label>
	<div class="control">
		<textarea {id} class="textarea is-medium" {placeholder} bind:value={$value} />
	</div>
	{#if help}
		<p class="help is-medium">{help}</p>
	{/if}
</div>

<style>
	::placeholder {
		color: inherit !important;
		opacity: 0.5;
	}

	.help {
		font-size: 1rem;
		opacity: 0.8;
	}
</style>
