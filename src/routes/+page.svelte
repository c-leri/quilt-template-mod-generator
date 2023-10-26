<script lang="ts">
	import {
		GENERIC_JSON_INVALID_CHARACTERS,
		GROUP_ID_VALID_CHARACTERS,
		MOD_ID_VALID_CHARACTERS,
		MOD_VERSION_VALID_CHARACTERS,
		URL_PATTERN
	} from '$lib/constants/field_validators';
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
	import type { SelectOption } from '$lib/types';
	import { onDestroy, onMount } from 'svelte';
	import { readable, writable, type Writable } from 'svelte/store';
	import {
		mod_name,
		mod_id,
		group_id,
		mod_version,
		author,
		description,
		homepage_url,
		source_url,
		issues_url,
		is_minecraft_stable,
		minecraft_version,
		quilt_loader_version,
		quilt_mappings_version,
		use_qsl_qfapi,
		qsl_qfapi_version,
		mod_environment,
		use_mixins,
		license
	} from '$lib/stores/field_values';
	import {
		is_mod_name_error,
		is_mod_id_error,
		is_group_id_error,
		is_mod_version_error,
		is_author_error,
		is_description_error,
		is_homepage_url_error,
		is_source_url_error,
		is_issues_url_error,
		is_minecraft_version_error,
		is_quilt_loader_version_error,
		is_quilt_mappings_version_error,
		is_qsl_qfapi_version_error
	} from '$lib/stores/field_errors';
	import type { Unsubscriber } from 'svelte/motion';
	import { licenses, mod_environments } from '$lib/constants/field_options';
	import { generate_template } from '$lib/generate_template';

	const unsubscribers: Unsubscriber[] = [];

	const minecraft_versions: Writable<SelectOption[]> = writable([]);
	const quilt_loader_versions: Writable<SelectOption[]> = writable([]);
	const quilt_mappings_versions: Writable<SelectOption[]> = writable([]);
	const qsl_qfapi_versions: Writable<SelectOption[]> = writable([]);

	onMount(async () => {
		unsubscribers.push(
			is_minecraft_stable.subscribe((is_minecraft_stable) =>
				get_minecraft_versions(is_minecraft_stable)
					.then((minecraft_versions) => {
						$minecraft_versions = minecraft_versions;
						$is_minecraft_version_error = false;
					})
					.catch(() => ($is_minecraft_version_error = true))
			)
		);

		unsubscribers.push(
			minecraft_version.subscribe((minecraft_version) => {
				if (minecraft_version) {
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
				} else {
					$quilt_loader_versions = [];
					$quilt_mappings_versions = [];
					$qsl_qfapi_versions = [];
				}
			})
		);
	});

	onDestroy(() => unsubscribers.forEach((unsubscriber) => unsubscriber));

	// prettier-ignore
	// Generate button
	$: is_generate_button_disabled =
		!$mod_name || $is_mod_name_error ||
		!$mod_id || $is_mod_id_error ||
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

		<SelectField label="Environment" options={readable(mod_environments)} value={mod_environment} />
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

		<SelectField label="License" options={readable(licenses)} value={license}>
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
		<button
			on:click={generate_template}
			class="button is-primary is-medium"
			disabled={is_generate_button_disabled}
		>
			Generate Template
		</button>
	</div>
</main>
