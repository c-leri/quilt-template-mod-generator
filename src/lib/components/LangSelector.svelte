<script lang="ts">
	import { browser } from '$app/environment';
	import { locale, locales, t } from '$lib/translations';
	import { onDestroy } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';

	let unsubscriber: Unsubscriber;

	if (browser) {
		const user_locale: string = window.localStorage.getItem('lang') || window.navigator.language;
		if ($locales.includes(user_locale)) {
			$locale = user_locale;
		}

		locale.subscribe((locale) => localStorage.setItem('lang', locale));
	}

	onDestroy(() => unsubscriber && unsubscriber());
</script>

<div class="control has-icons-left">
	<div class="select">
		<select bind:value={$locale}>
			{#each $locales as value}
				<option {value}>{$t(`lang.${value}`)}</option>
			{/each}
		</select>
	</div>
	<div class="icon is-left">
		<i class="fas fa-language" />
	</div>
</div>
