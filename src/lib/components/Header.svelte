<script lang="ts">
	import { browser } from '$app/environment';
	import { base } from '$app/paths';
	import { t } from '$lib/translations';
	import NavbarLangDropdown from './NavbarLangDropdown.svelte';

	let display_width: number;
	let menu_open: boolean;
</script>

<svelte:window bind:innerWidth={display_width} />

<input id="toggle-navbar" type="checkbox" class="is-hidden" bind:checked={menu_open} />
<nav class="navbar is-dark" aria-label="main navigation" data-controller="navbar">
	<div class="navbar-brand">
		<a class="navbar-item navbar-logo" href="{base}/">
			<img src="https://quiltmc.org/assets/img/logo.svg" alt="Quilt Logo" height="28" width="28" />

			<span class="ml-2">
				{browser && display_width <= 768 ? $t('general.title.short') : $t('general.title')}
			</span>
		</a>

		<label class="navbar-burger" for="toggle-navbar" aria-label="menu" aria-expanded={menu_open}>
			<span aria-hidden="true" />
			<span aria-hidden="true" />
			<span aria-hidden="true" />
		</label>
	</div>

	<div class="navbar-menu" data-navbar-target="menu">
		<div class="navbar-start">
			<NavbarLangDropdown />
		</div>

		<div class="navbar-end">
			<a
				href="https://github.com/c-leri/quilt-template-mod-generator/issues"
				class="navbar-item has-icon"
				target="_blank"
			>
				<span class="icon"><div class="i-fa6-solid-bug i-xl" /></span>
				<span class="is-hidden-desktop">Issues</span>
			</a>
			<a
				href="https://github.com/c-leri/quilt-template-mod-generator"
				class="navbar-item has-icon"
				target="_blank"
			>
				<span class="icon"><div class="i-fa6-brands-github i-xl" /></span>
				<span class="is-hidden-desktop">Source</span>
			</a>
		</div>
	</div>
</nav>
