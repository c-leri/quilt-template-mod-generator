<script lang="ts">
	import type { Option } from '$lib/types';
	import type { Writable } from 'svelte/store';

	export let label: string;
	export let options: Option[];
	export let value: Writable<string>;

	const id = crypto.randomUUID();
</script>

<div class="field">
	<label for={id} class="label is-medium">{label}</label>
	<div class="control">
		<div class="select is-medium is-fullwidth">
			<select {id} bind:value={$value}>
				{#each options as option}
					{#if option.value}
						<option value={option.value}>{option.name}</option>
					{:else}
						<option>{option.name}</option>
					{/if}
				{/each}
			</select>
		</div>
	</div>
	<p class="help is-medium">
		<slot />
	</p>
</div>

<style>
	.help {
		font-size: 1rem;
		opacity: 0.8;
	}
</style>
