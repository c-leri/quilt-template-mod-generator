<script lang="ts">
	import type { SelectOption } from '$lib/types';
	import { readable, type Readable, type Writable } from 'svelte/store';
	import { onDestroy } from 'svelte';
	import { t } from '$lib/translations';

	export let label: string;
	export let options: Readable<SelectOption[] | undefined>;
	export let error: Readable<boolean> = readable(false);
	export let value: Writable<string>;
	const unsubscriber = options.subscribe((options) => {
		if (options?.length) {
			if (!$value || !options.find((option) => option.value === $value || option.name === $value)) {
				$value = options[0].value !== undefined ? options[0].value : options[0].name;
			}
		}
	});

	onDestroy(unsubscriber);

	const id = crypto.randomUUID();
</script>

<div class="field">
	<label for={id} class="label is-medium">{label}</label>
	<div class="control">
		<div
			class="select is-medium is-fullwidth {$error
				? 'is-danger'
				: $options === undefined && 'is-loading'}"
		>
			<select {id} bind:value={$value}>
				{#if $options}
					{#each $options as option}
						{#if option.value !== undefined}
							<option value={option.value}>
								{option.translatable ? $t(option.name) : option.name}
							</option>
						{:else}
							<option>{option.translatable ? $t(option.name) : option.name}</option>
						{/if}
					{/each}
				{/if}
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
