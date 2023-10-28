<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import { t } from '$lib/translations';
	import prism_dark from 'quilt-bulma/dist/style-dark.min.css?url';
	import prism_light from 'quilt-bulma/dist/style-light.min.css?url';
	import fontawesome_solid from '@fortawesome/fontawesome-free/js/solid.js?url';
	import fontawesome_brands from '@fortawesome/fontawesome-free/js/brands.js?url';
	import fontawesome from '@fortawesome/fontawesome-free/js/fontawesome.js?url';
</script>

<svelte:head>
	<link rel="stylesheet" href={prism_dark} media="(prefers-color-scheme:dark)" />
	<link rel="stylesheet" href={prism_light} media="(prefers-color-scheme:light)" />
	<script defer src={fontawesome_solid}></script>
	<script defer src={fontawesome_brands}></script>
	<script defer src={fontawesome}></script>
	<title>{$t('general.title')}</title>
</svelte:head>

<input id="toggle-navbar" type="checkbox" class="is-hidden" />
<Header />

<div class="container">
	<slot />
</div>

<Footer />
