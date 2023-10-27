<script>
	import { base } from '$app/paths';
	import { _ } from 'svelte-i18n';
</script>

<nav class="navbar is-dark" aria-label="main navigation" data-controller="navbar">
	<div class="navbar-brand no-style">
		<a class="navbar-item navbar-logo" href="{base}/">
			<img src="https://quiltmc.org/assets/img/logo.svg" alt="Quilt Logo" height="28" width="28" />

			<span class="ml-2">{$_('title')}</span>
		</a>

		<label class="navbar-burger" for="toggle-navbar" aria-label="menu">
			<span aria-hidden="true" />
			<span aria-hidden="true" />
			<span aria-hidden="true" />
		</label>
	</div>

	<div class="navbar-menu" data-navbar-target="menu">
		<div class="navbar-end">
			<a
				href="https://github.com/c-leri/quilt-template-mod-generator"
				class="navbar-item has-icon"
				target="_blank"
			>
				<span class="icon"><i class="fab fa-github fa-xl" /></span>
				<span class="is-hidden-desktop">Github</span>
			</a>
		</div>
	</div>
</nav>
