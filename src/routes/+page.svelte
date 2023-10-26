<script lang="ts">
	import CheckBoxField from '$lib/components/CheckBoxField.svelte';
	import SelectField from '$lib/components/SelectField.svelte';
	import TextAreaField from '$lib/components/TextAreaField.svelte';
	import TextInputField from '$lib/components/TextInputField.svelte';
	import { writable, type Writable } from 'svelte/store';

	let mod_name: Writable<string> = writable();
	let mod_id: Writable<string> = writable();
	let group_id: Writable<string> = writable();
	let mod_version: Writable<string> = writable();
	let mod_environment: Writable<string> = writable();
	let minecraft_version: Writable<string> = writable();
	let is_minecraft_stable: Writable<boolean> = writable(true);
	let quilt_loader_version: Writable<string> = writable();
	let use_qsl_qfapi: Writable<boolean> = writable(true);
	let qsl_qfapi_version: Writable<string> = writable();
	let use_mixins: Writable<boolean> = writable(true);
	let author: Writable<string> = writable();
	let description: Writable<string> = writable();
	let license: Writable<string> = writable();
	let homepage_url: Writable<string> = writable();
	let source_url: Writable<string> = writable();
	let issues_url: Writable<string> = writable();
</script>

<svelte:head>
	<title>Quilt Template Mod Generator</title>
</svelte:head>

<main>
	<section class="section">
		<h1 class="title has-text-centered">Mod Configuration</h1>

		<TextInputField label="Mod Name" placeholder="Example Mod" value={mod_name} />

		<TextInputField label="Mod Id" placeholder="example_mod" value={mod_id} />

		<TextInputField label="Groupd ID" placeholder="net.example" value={group_id}>
			If you are unsure as to what group ID to use and you are planning to host your mod's source
			code on Github, use <code>io.github.&lt;YOUR_USERNAME&gt;</code>
		</TextInputField>

		<TextInputField label="Mod Version" placeholder="0.0.1" value={mod_version} />

		<SelectField
			label="Environment"
			options={[
				{ name: 'Both', value: 'both' },
				{ name: 'Client', value: 'client' },
				{ name: 'Server', value: 'server' }
			]}
			value={mod_environment}
		/>
	</section>

	<section class="section">
		<h1 class="title has-text-centered">Dependencies Configuration</h1>

		<SelectField label="Minecraft Version" options={[]} value={minecraft_version} />

		<CheckBoxField label="Stable ?" checked={is_minecraft_stable} />

		<SelectField label="Quilt Loader Version" options={[]} value={quilt_loader_version} />

		<CheckBoxField label="Use QSL/QFAPI ?" checked={use_qsl_qfapi} />

		{#if $use_qsl_qfapi}
			<SelectField label="QSL/QFAPI Version" options={[]} value={qsl_qfapi_version} />
		{/if}

		<CheckBoxField label="Use Mixins ?" checked={use_mixins} />
	</section>

	<section class="section">
		<h1 class="title has-text-centered">Optional Mod Metadata</h1>

		<TextInputField label="Author" placeholder="That's you" value={author} />

		<TextAreaField
			label="Description"
			placeholder="A short description of your mod."
			value={description}
		/>

		<SelectField
			label="License"
			options={[
				{ name: 'No License', value: '' },
				{ name: 'The Unlicense', value: 'Unlicense' },
				{ name: 'Creative Commons Zero', value: 'CC0-1.0' },
				{ name: 'GNU Lesser General Public License v3.0', value: 'LGPL-3.0-only' },
				{ name: 'MIT License', value: 'MIT' },
				{ name: 'Apache License 2.0', value: 'Apache-2.0' },
				{ name: 'Mozilla Public License 2.0', value: 'MPL-2.0' }
			]}
			value={license}
		>
			If you don't know what license to choose, you can use
			<a href="https://choosealicense.com/">this tool</a>
		</SelectField>

		<TextInputField label="Homepage Link" placeholder="https://example.com" value={homepage_url} />

		<TextInputField
			label="Source Repository Link"
			placeholder="https://github.com/your-name/example-mod"
			value={source_url}
		/>

		<TextInputField
			label="Issues Tracker Link"
			placeholder="https://github.com/your-name/example-mod/issues"
			value={issues_url}
		/>
	</section>

	<div class="is-flex is-justify-content-center mb-6">
		<button class="button is-primary is-medium">Generate Template</button>
	</div>
</main>
