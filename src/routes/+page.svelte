<script lang="ts">
	import {
		GENERIC_JSON_INVALID_CHARACTERS,
		GENERIC_JSON_VALIDATOR,
		GROUP_ID_VALIDATOR,
		GROUP_ID_VALID_CHARACTERS,
		MOD_ID_VALIDATOR,
		MOD_ID_VALID_CHARACTERS,
		MOD_VERSION_VALIDATOR,
		MOD_VERSION_VALID_CHARACTERS,
		URL_PATTERN,
		URL_VALIDATOR
	} from '$lib/FIeldValidators';
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
	const mod_name: Writable<string> = writable();
	const is_mod_name_error: Writable<boolean> = writable(false);
	mod_name.subscribe(
		(mod_name) =>
			($is_mod_name_error = mod_name !== undefined && GENERIC_JSON_VALIDATOR.test(mod_name))
	);

	// Mod ID Input
	const mod_id: Writable<string> = writable();
	const is_mod_id_error: Writable<boolean> = writable(false);
	mod_id.subscribe(
		(mod_id) => ($is_mod_id_error = mod_id !== undefined && MOD_ID_VALIDATOR.test(mod_id))
	);

	// Group ID Input
	const group_id: Writable<string> = writable();
	const is_group_id_error: Writable<boolean> = writable(false);
	group_id.subscribe(
		(group_id) => ($is_group_id_error = group_id !== undefined && GROUP_ID_VALIDATOR.test(group_id))
	);

	// Mod Version Input
	const mod_version: Writable<string> = writable();
	const is_mod_version_error: Writable<boolean> = writable(false);
	mod_version.subscribe(
		(mod_version) =>
			($is_mod_version_error = mod_version !== undefined && MOD_VERSION_VALIDATOR.test(mod_version))
	);

	// Mod Environment Select
	const mod_environment: Writable<string> = writable();

	// Minecraft Version Select
	const minecraft_versions: Writable<Option[]> = writable([]);
	const minecraft_version: Writable<string> = writable();
	const is_minecraft_version_error: Writable<boolean> = writable(false);

	// Minecraft Stable Checkbox
	const is_minecraft_stable: Writable<boolean> = writable(true);

	// Quilt Loader Version Select
	const quilt_loader_versions: Writable<Option[]> = writable([]);
	const quilt_loader_version: Writable<string> = writable();
	const is_quilt_loader_version_error: Writable<boolean> = writable(false);

	// Quilt Mappings Version Select
	const quilt_mappings_versions: Writable<Option[]> = writable([]);
	const quilt_mappings_version: Writable<string> = writable();
	const is_quilt_mappings_version_error: Writable<boolean> = writable(false);

	// Use QSL/QFAPI Checkbox
	const use_qsl_qfapi: Writable<boolean> = writable(true);

	// QSL/QFAPI Version Select
	const qsl_qfapi_versions: Writable<Option[]> = writable([]);
	const qsl_qfapi_version: Writable<string> = writable();
	const is_qsl_qfapi_version_error: Writable<boolean> = writable(false);

	// Use Mixins Checkbox
	const use_mixins: Writable<boolean> = writable(true);

	// Author Input
	const author: Writable<string> = writable();
	const is_author_error: Writable<boolean> = writable(false);
	author.subscribe(
		(author) => ($is_author_error = author !== undefined && GENERIC_JSON_VALIDATOR.test(author))
	);

	// Description TextArea
	const description: Writable<string> = writable();
	const is_description_error: Writable<boolean> = writable(false);
	description.subscribe(
		(description) =>
			($is_description_error =
				description !== undefined && GENERIC_JSON_VALIDATOR.test(description))
	);

	// License Select
	const license: Writable<string> = writable();

	// Homepage URL Input
	const homepage_url: Writable<string> = writable();
	const is_homepage_url_error: Writable<boolean> = writable(false);
	homepage_url.subscribe(
		(homepage_url) =>
			($is_homepage_url_error = homepage_url !== undefined && !URL_VALIDATOR.test(homepage_url))
	);

	// Source Repository URL Input
	const source_url: Writable<string> = writable();
	const is_source_url_error: Writable<boolean> = writable(false);
	source_url.subscribe(
		(source_url) =>
			($is_source_url_error = source_url !== undefined && !URL_VALIDATOR.test(source_url))
	);

	// Issues Tracker URL Input
	const issues_url: Writable<string> = writable();
	const is_issues_url_error: Writable<boolean> = writable(false);
	issues_url.subscribe(
		(issues_url) =>
			($is_issues_url_error = issues_url !== undefined && !URL_VALIDATOR.test(issues_url))
	);

	// prettier-ignore
	// Generate button
	$: is_generate_button_disabled =
		(!$mod_name || $is_mod_name_error) ||
		(!$mod_id || $is_mod_id_error) ||
		!$group_id || $is_group_id_error ||
		!$mod_version || $is_mod_version_error ||
		!$minecraft_version ||
		!$quilt_loader_version ||
		!$quilt_mappings_version ||
		($use_qsl_qfapi && !$qsl_qfapi_version) ||
		$is_author_error ||
		$is_description_error ||
		$is_homepage_url_error ||
		$is_source_url_error ||
		$is_issues_url_error;

	onMount(async () => {
		is_minecraft_stable.subscribe((is_minecraft_stable) =>
			get_minecraft_versions(is_minecraft_stable)
				.then((minecraft_versions) => {
					$minecraft_versions = minecraft_versions;
					$is_minecraft_version_error = false;
				})
				.catch(() => ($is_minecraft_version_error = true))
		);

		minecraft_version.subscribe((minecraft_version) => {
			get_quilt_loader_versions(minecraft_version)
				.then((quilt_loader_versions) => {
					$quilt_loader_versions = quilt_loader_versions;
					$is_quilt_loader_version_error = false;
				})
				.catch(() => ($is_quilt_loader_version_error = true));

			get_quilt_mappings_versions(minecraft_version)
				.then((quilt_mappings_versions) => {
					$quilt_mappings_versions = quilt_mappings_versions;
					$is_quilt_mappings_version_error = false;
				})
				.catch(() => ($is_quilt_mappings_version_error = true));

			get_qsl_qfapi_versions(minecraft_version)
				.then((qsl_qfapi_versions) => {
					$qsl_qfapi_versions = qsl_qfapi_versions;
					$is_qsl_qfapi_version_error = false;
				})
				.catch(() => ($is_qsl_qfapi_version_error = true));
		});
	});
</script>

<svelte:head>
	<title>Quilt Template Mod Generator</title>
</svelte:head>

<main>
	<section class="section">
		<h1 class="title has-text-centered">Mod Configuration</h1>

		<TextInputField
			label="Mod Name"
			placeholder="Example Mod"
			error={is_mod_name_error}
			value={mod_name}
		>
			{#if $is_mod_name_error}
				Your mod's name cannot contain the following characters:
				<code>{GENERIC_JSON_INVALID_CHARACTERS}</code>
			{/if}
		</TextInputField>

		<TextInputField label="Mod Id" placeholder="example_mod" error={is_mod_id_error} value={mod_id}>
			{#if $is_mod_id_error}
				Your mod id must contain only the following characters:
				<code>{MOD_ID_VALID_CHARACTERS}</code>
			{/if}
		</TextInputField>

		<TextInputField
			label="Groupd ID"
			placeholder="net.example"
			error={is_group_id_error}
			value={group_id}
		>
			{#if $is_group_id_error}
				Your group id must contain only the following characters:
				<code>{GROUP_ID_VALID_CHARACTERS}</code>
			{:else}
				If you are unsure as to what group ID to use and you are planning to host your mod's source
				code on Github, use <code>io.github.&lt;YOUR_USERNAME&gt;</code>
			{/if}
		</TextInputField>

		<TextInputField
			label="Mod Version"
			placeholder="0.0.1"
			error={is_mod_version_error}
			value={mod_version}
		>
			{#if $is_mod_version_error}
				Your mod's version must only contain the following characters:
				<code>{MOD_VERSION_VALID_CHARACTERS}</code>
			{/if}
		</TextInputField>

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
			error={is_minecraft_version_error}
		>
			{#if $is_minecraft_version_error}
				Unable to fetch Minecraft versions, please try again later
			{/if}
		</SelectField>

		<CheckboxField label="Stable ?" checked={is_minecraft_stable} />

		<SelectField
			label="Quilt Loader Version"
			options={quilt_loader_versions}
			error={is_quilt_loader_version_error}
			value={quilt_loader_version}
		>
			{#if $is_quilt_loader_version_error}
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
			error={is_quilt_mappings_version_error}
		>
			{#if $is_quilt_mappings_version_error}
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
				error={is_qsl_qfapi_version_error}
			>
				{#if $is_qsl_qfapi_version_error}
					Unable to fetch QSL/QFAPI versions for {$minecraft_version
						? `Minecraft version ${$minecraft_version}`
						: 'this Minecraft version'}
				{:else if !$qsl_qfapi_versions.length}
					No QSL/QFAPI versions were found for {$minecraft_version
						? `Minecraft version ${$minecraft_version}`
						: 'this Minecraft version'}
				{/if}
			</SelectField>
		{/if}

		<CheckboxField label="Use Mixins ?" checked={use_mixins} />
	</section>

	<section class="section">
		<h1 class="title has-text-centered">Optional Mod Metadata</h1>

		<TextInputField label="Author" placeholder="That's you" error={is_author_error} value={author}>
			{#if $is_author_error}
				Your name cannot contain the following characters:
				<code>{GENERIC_JSON_INVALID_CHARACTERS}</code>
			{/if}
		</TextInputField>

		<TextAreaField
			label="Description"
			placeholder="A short description of your mod."
			error={is_description_error}
			value={description}
		>
			{#if $is_description_error}
				Your mod's description cannot contain the following characters:
				<code>{GENERIC_JSON_INVALID_CHARACTERS}</code>
			{/if}
		</TextAreaField>

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

		<TextInputField
			label="Homepage URL"
			placeholder="https://example.com"
			error={is_homepage_url_error}
			value={homepage_url}
		>
			{#if $is_homepage_url_error}
				Your mod's homepage url must match the following pattern:
				<code>{URL_PATTERN}</code>
			{/if}
		</TextInputField>

		<TextInputField
			label="Source Repository URL"
			placeholder="https://github.com/your-name/example-mod"
			error={is_source_url_error}
			value={source_url}
		>
			{#if $is_source_url_error}
				Your mod's source repository url must match the following pattern:
				<code>{URL_PATTERN}</code>
			{/if}
		</TextInputField>

		<TextInputField
			label="Issue Tracker URL"
			placeholder="https://github.com/your-name/example-mod/issues"
			error={is_issues_url_error}
			value={issues_url}
		>
			{#if $is_issues_url_error}
				Your mod's issue tracker url must match the following pattern:
				<code>{URL_PATTERN}</code>
			{/if}
		</TextInputField>
	</section>

	<div class="is-flex is-justify-content-center mb-6">
		<button class="button is-primary is-medium" disabled={is_generate_button_disabled}>
			Generate Template
		</button>
	</div>
</main>
