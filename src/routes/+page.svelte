<script lang="ts">
	import CheckboxField from '$lib/components/CheckboxField.svelte';
	import SelectField from '$lib/components/SelectField.svelte';
	import TextAreaField from '$lib/components/TextAreaField.svelte';
	import TextInputField from '$lib/components/TextInputField.svelte';
	import {
		get_minecraft_versions,
		get_qsl_qfapi_versions,
		get_quilt_loader_versions,
		get_quilt_mappings_versions
	} from '$lib/get_versions';
	import type { Option } from '$lib/types';
	import { onMount } from 'svelte';
	import { readable, writable, type Writable } from 'svelte/store';

	// Mod Name Input
	let mod_name: Writable<string> = writable();

	// Mod ID Input
	let mod_id: Writable<string> = writable();

	// Group ID Input
	let group_id: Writable<string> = writable();

	// Mod Version Input
	let mod_version: Writable<string> = writable();

	// Mod Environment Select
	let mod_environment: Writable<string> = writable();

	// Minecraft Version Select
	let minecraft_versions: Writable<Option[]> = writable([]);
	let minecraft_version: Writable<string> = writable();
	let minecraft_version_is_error: Writable<boolean> = writable(false);

	// Minecraft Stable Checkbox
	let is_minecraft_stable: Writable<boolean> = writable(true);

	// Quilt Loader Version Select
	let quilt_loader_versions: Writable<Option[]> = writable([]);
	let quilt_loader_version: Writable<string> = writable();
	let quilt_loader_version_is_error: Writable<boolean> = writable(false);

	// Quilt Mappings Version Select
	let quilt_mappings_versions: Writable<Option[]> = writable([]);
	let quilt_mappings_version: Writable<string> = writable();
	let quilt_mappings_version_is_error: Writable<boolean> = writable(false);

	// Use QSL/QFAPI Checkbox
	let use_qsl_qfapi: Writable<boolean> = writable(true);

	// QSL/QFAPI Version Select
	let qsl_qfapi_versions: Writable<Option[]> = writable([]);
	let qsl_qfapi_version: Writable<string> = writable();
	let qsl_qfapi_version_is_error: Writable<boolean> = writable(false);

	// Use Mixins Checkbox
	let use_mixins: Writable<boolean> = writable(true);

	// Author Input
	let author: Writable<string> = writable();

	// Description TextArea
	let description: Writable<string> = writable();

	// License Select
	let license: Writable<string> = writable();

	// Homepage URL Input
	let homepage_url: Writable<string> = writable();

	// Source Repository URL Input
	let source_url: Writable<string> = writable();

	// Issues Tracker URL Input
	let issues_url: Writable<string> = writable();

	onMount(async () => {
		is_minecraft_stable.subscribe((is_minecraft_stable) =>
			get_minecraft_versions(is_minecraft_stable)
				.then((minecraft_versions) => {
					$minecraft_versions = minecraft_versions;
					$minecraft_version_is_error = false;
				})
				.catch(() => ($minecraft_version_is_error = true))
		);

		minecraft_version.subscribe((minecraft_version) => {
			get_quilt_loader_versions(minecraft_version)
				.then((quilt_loader_versions) => {
					$quilt_loader_versions = quilt_loader_versions;
					$quilt_loader_version_is_error = false;
				})
				.catch(() => ($quilt_loader_version_is_error = true));

			get_quilt_mappings_versions(minecraft_version)
				.then((quilt_mappings_versions) => {
					$quilt_mappings_versions = quilt_mappings_versions;
					$quilt_mappings_version_is_error = false;
				})
				.catch(() => ($quilt_mappings_version_is_error = true));

			get_qsl_qfapi_versions(minecraft_version)
				.then((qsl_qfapi_versions) => {
					$qsl_qfapi_versions = qsl_qfapi_versions;
					$qsl_qfapi_version_is_error = false;
				})
				.catch(() => ($qsl_qfapi_version_is_error = true));
		});
	});
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
			options={readable([
				{ name: 'Both', value: 'both' },
				{ name: 'Client', value: 'client' },
				{ name: 'Server', value: 'server' }
			])}
			value={mod_environment}
		/>
	</section>

	<section class="section">
		<h1 class="title has-text-centered">Dependencies Configuration</h1>

		<SelectField
			label="Minecraft Version"
			options={minecraft_versions}
			value={minecraft_version}
			error={minecraft_version_is_error}
		>
			{#if $minecraft_version_is_error}
				Unable to fetch Minecraft versions, please try again later
			{/if}
		</SelectField>

		<CheckboxField label="Stable ?" checked={is_minecraft_stable} />

		<SelectField
			label="Quilt Loader Version"
			options={quilt_loader_versions}
			error={quilt_loader_version_is_error}
			value={quilt_loader_version}
		>
			{#if $quilt_loader_version_is_error}
				Unable to fetch Quilt Loader versions for {$minecraft_version
					? `Minecraft version ${$minecraft_version}`
					: 'this Minecraft version'}
			{:else if !$quilt_loader_versions.length}
				No Quilt Loader versions were found for {$minecraft_version
					? `Minecraft version ${$minecraft_version}`
					: 'this Minecraft version'}, your project will be generated without it
			{/if}
		</SelectField>

		<SelectField
			label="Quilt Mappings Version"
			options={quilt_mappings_versions}
			value={quilt_mappings_version}
			error={quilt_mappings_version_is_error}
		>
			{#if $quilt_mappings_version_is_error}
				Unable to fetch Quilt Mappings versions for {$minecraft_version
					? `Minecraft version ${$minecraft_version}`
					: 'this Minecraft version'}
			{:else if !$quilt_mappings_versions.length}
				No Quilt Mappings versions were found for {$minecraft_version
					? `Minecraft version ${$minecraft_version}`
					: 'this Minecraft version'}, your project will be generated without it
			{/if}
		</SelectField>

		<CheckboxField label="Use QSL/QFAPI ?" checked={use_qsl_qfapi} />

		{#if $use_qsl_qfapi}
			<SelectField
				label="QSL/QFAPI Version"
				options={qsl_qfapi_versions}
				value={qsl_qfapi_version}
				error={qsl_qfapi_version_is_error}
			>
				{#if $qsl_qfapi_version_is_error}
					Unable to fetch QSL/QFAPI versions for {$minecraft_version
						? `Minecraft version ${$minecraft_version}`
						: 'this Minecraft version'}
				{:else if !$qsl_qfapi_versions.length}
					No QSL/QFAPI versions were found for {$minecraft_version
						? `Minecraft version ${$minecraft_version}`
						: 'this Minecraft version'}, your project will be generated without it
				{/if}
			</SelectField>
		{/if}

		<CheckboxField label="Use Mixins ?" checked={use_mixins} />
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
			options={readable([
				{ name: 'No License', value: '' },
				{ name: 'The Unlicense', value: 'Unlicense' },
				{ name: 'Creative Commons Zero', value: 'CC0-1.0' },
				{ name: 'GNU Lesser General Public License v3.0', value: 'LGPL-3.0-only' },
				{ name: 'MIT License', value: 'MIT' },
				{ name: 'Apache License 2.0', value: 'Apache-2.0' },
				{ name: 'Mozilla Public License 2.0', value: 'MPL-2.0' }
			])}
			value={license}
		>
			If you don't know what license to choose, you can use
			<a href="https://choosealicense.com/">this tool</a>
		</SelectField>

		<TextInputField label="Homepage URL" placeholder="https://example.com" value={homepage_url} />

		<TextInputField
			label="Source Repository URL"
			placeholder="https://github.com/your-name/example-mod"
			value={source_url}
		/>

		<TextInputField
			label="Issues Tracker URL"
			placeholder="https://github.com/your-name/example-mod/issues"
			value={issues_url}
		/>
	</section>

	<div class="is-flex is-justify-content-center mb-6">
		<button class="button is-primary is-medium">Generate Template</button>
	</div>
</main>
