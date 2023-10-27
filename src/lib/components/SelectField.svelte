<script lang="ts">
	import type { SelectOption } from '$lib/types';
	import { readable, type Readable, type Writable } from 'svelte/store';
	import { _ } from 'svelte-i18n';

	export let label: string;
	export let options: Readable<SelectOption[]>;
	export let error: Readable<boolean> = readable(false);
	export let value: Writable<string>;
	options.subscribe((options) => {
		if (options.length) {
			if (!$value || !options.find((option) => option.value === $value || option.name === $value)) {
				$value = options[0].value !== undefined ? options[0].value : options[0].name;
			}
		}
	});

	const id = crypto.randomUUID();
</script>

<div class="field">
	<label for={id} class="label is-medium">{label}</label>
	<div class="control">
		<div class="select is-medium is-fullwidth {$error ? 'is-danger' : ''}">
			<select {id} bind:value={$value}>
				{#each $options as option}
					{#if option.value !== undefined}
						<option value={option.value}>
							{option.translatable ? $_(option.name) : option.name}
						</option>
					{:else}
						<option>{option.translatable ? $_(option.name) : option.name}</option>
					{/if}
				{/each}
			</select>
		</div>
	</div>
	<p class="help is-medium {$error ? 'is-danger' : ''}">
		<slot />
	</p>
</div>

<style>
	.help {
		font-size: 1rem;
		opacity: 0.8;
	}
</style>
