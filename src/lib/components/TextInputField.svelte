<script lang="ts">
	import { readable, type Readable, type Writable } from 'svelte/store';

	export let label: string;
	export let placeholder: string;
	export let error: Readable<boolean> = readable(false);
	export let value: Writable<string>;

	const id = crypto.randomUUID();
</script>

<div class="field">
	<label for={id} class="label is-medium">{label}</label>
	<div class="control">
		<input
			{id}
			class="input is-mediu {$error ? 'is-danger' : ''}"
			type="text"
			{placeholder}
			bind:value={$value}
		/>
	</div>
	<p class="help is-medium {$error ? 'is-danger' : ''}">
		<slot />
	</p>
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
