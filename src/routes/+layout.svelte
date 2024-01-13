<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import { t } from '$lib/translations';
	import prism_dark from 'quilt-bulma/dist/style-dark.min.css?url';
	import prism_light from 'quilt-bulma/dist/style-light.min.css?url';
</script>

<svelte:head>
	<link rel="stylesheet" href={prism_dark} media="(prefers-color-scheme:dark)" />
	<link rel="stylesheet" href={prism_light} media="(prefers-color-scheme:light)" />
	<title>{$t('general.title')}</title>
</svelte:head>

<Header />

<div class="container">
	<slot />
</div>

<Footer />
