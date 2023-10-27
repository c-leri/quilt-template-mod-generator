<script lang="ts">
	import snarkdown from 'snarkdown';
	import { _ } from 'svelte-i18n';
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

	onDestroy(() => unsubscribers.forEach((unsubscriber) => unsubscriber()));

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
	<title>{$_('title')}</title>
</svelte:head>

<main>
	<section class="section">
		<h1 class="title has-text-centered">{$_('mod_configuration.title')}</h1>

		<TextInputField
			label={$_('mod_configuration.mod_name.label')}
			placeholder={$_('mod_configuration.mod_name.placeholder')}
			error={is_mod_name_error}
			value={mod_name}
		>
			{#if $is_mod_name_error}
				{@html snarkdown(
					$_('mod_configuration.mod_name.error').replace('{}', GENERIC_JSON_INVALID_CHARACTERS)
				)}
			{/if}
		</TextInputField>

		<TextInputField
			label={$_('mod_configuration.mod_id.label')}
			placeholder={$_('mod_configuration.mod_id.placeholder')}
			error={is_mod_id_error}
			value={mod_id}
		>
			{#if $is_mod_id_error}
				{@html snarkdown(
					$_('mod_configuration.mod_id.error').replace('{}', MOD_ID_VALID_CHARACTERS)
				)}
			{/if}
		</TextInputField>

		<TextInputField
			label={$_('mod_configuration.group_id.label')}
			placeholder={$_('mod_configuration.group_id.placeholder')}
			error={is_group_id_error}
			value={group_id}
		>
			{#if $is_group_id_error}
				{@html snarkdown(
					$_('mod_configuration.group_id.error').replace('{}', GROUP_ID_VALID_CHARACTERS)
				)}
			{:else}
				{@html snarkdown($_('mod_configuration.group_id.help'))}
			{/if}
		</TextInputField>

		<TextInputField
			label={$_('mod_configuration.mod_version.label')}
			placeholder={$_('mod_configuration.mod_version.placeholder')}
			error={is_mod_version_error}
			value={mod_version}
		>
			{#if $is_mod_version_error}
				{@html snarkdown(
					$_('mod_configuration.mod_version.error').replace('{}', MOD_VERSION_VALID_CHARACTERS)
				)}
			{/if}
		</TextInputField>

		<SelectField
			label={$_('mod_configuration.mod_environment.label')}
			options={readable(mod_environments)}
			value={mod_environment}
		/>
	</section>

	<section class="section">
		<h1 class="title has-text-centered">{$_('dependencies_configuration.title')}</h1>

		<SelectField
			label={$_('dependencies_configuration.minecraft_version.label')}
			options={minecraft_versions}
			value={minecraft_version}
			error={is_minecraft_version_error}
		>
			{#if $is_minecraft_version_error}
				{$_('dependencies_configuration.minecraft_version.error')}
			{/if}
		</SelectField>

		<CheckboxField
			label={$_('dependencies_configuration.minecraft_stable.label')}
			checked={is_minecraft_stable}
		/>

		<SelectField
			label={$_('dependencies_configuration.quilt_loader_version.label')}
			options={quilt_loader_versions}
			error={is_quilt_loader_version_error}
			value={quilt_loader_version}
		>
			{#if $is_quilt_loader_version_error}
				{$minecraft_version
					? $_(
							'dependencies_configuration.quilt_loader_version.error.with_minecraft_version'
					  ).replace('{}', $minecraft_version)
					: $_('dependencies_configuration.quilt_loader_version.error.without_minecraft_version')}
			{:else if !$quilt_loader_versions.length}
				{$minecraft_version
					? $_(
							'dependencies_configuration.quilt_loader_version.no_versions.with_minecraft_version'
					  ).replace('{}', $minecraft_version)
					: $_(
							'dependencies_configuration.quilt_loader_version.no_versions.without_minecraft_version'
					  )}
			{/if}
		</SelectField>

		<SelectField
			label={$_('dependencies_configuration.quilt_mappings_version.label')}
			options={quilt_mappings_versions}
			value={quilt_mappings_version}
			error={is_quilt_mappings_version_error}
		>
			{#if $is_quilt_mappings_version_error}
				{$minecraft_version
					? $_(
							'dependencies_configuration.quilt_mappings_version.error.with_minecraft_version'
					  ).replace('{}', $minecraft_version)
					: $_('dependencies_configuration.quilt_mappings_version.error.without_minecraft_version')}
			{:else if !$quilt_mappings_versions.length}
				{$minecraft_version
					? $_(
							'dependencies_configuration.quilt_mappings_version.no_versions.with_minecraft_version'
					  ).replace('{}', $minecraft_version)
					: $_(
							'dependencies_configuration.quilt_mappings_version.no_versions.without_minecraft_version'
					  )}
			{/if}
		</SelectField>

		<CheckboxField
			label={$_('dependencies_configuration.use_qsl_qfapi.label')}
			checked={use_qsl_qfapi}
		/>

		{#if $use_qsl_qfapi}
			<SelectField
				label={$_('dependencies_configuration.qsl_qfapi_version.label')}
				options={qsl_qfapi_versions}
				value={qsl_qfapi_version}
				error={is_qsl_qfapi_version_error}
			>
				{#if $is_qsl_qfapi_version_error}
					{$minecraft_version
						? $_(
								'dependencies_configuration.qsl_qfapi_version.error.with_minecraft_version'
						  ).replace('{}', $minecraft_version)
						: $_('dependencies_configuration.qsl_qfapi_version.error.without_minecraft_version')}
				{:else if !$qsl_qfapi_versions.length}
					{$minecraft_version
						? $_(
								'dependencies_configuration.qsl_qfapi_version.no_versions.with_minecraft_version'
						  ).replace('{}', $minecraft_version)
						: $_(
								'dependencies_configuration.qsl_qfapi_version.no_versions.without_minecraft_version'
						  )}
				{/if}
			</SelectField>
		{/if}

		<CheckboxField label={$_('dependencies_configuration.use_mixins.label')} checked={use_mixins} />
	</section>

	<section class="section">
		<h1 class="title has-text-centered">{$_('optional_metadata.title')}</h1>

		<TextInputField
			label={$_('optional_metadata.author.label')}
			placeholder={$_('optional_metadata.author.placeholder')}
			error={is_author_error}
			value={author}
		>
			{#if $is_author_error}
				{@html snarkdown(
					$_('optional_metadata.author.error').replace('{}', GENERIC_JSON_INVALID_CHARACTERS)
				)}
			{/if}
		</TextInputField>

		<TextAreaField
			label={$_('optional_metadata.description.label')}
			placeholder={$_('optional_metadata.description.placeholder')}
			error={is_description_error}
			value={description}
		>
			{#if $is_description_error}
				{@html snarkdown(
					$_('optional_metadata.description.error').replace('{}', GENERIC_JSON_INVALID_CHARACTERS)
				)}
			{/if}
		</TextAreaField>

		<SelectField
			label={$_('optional_metadata.license.label')}
			options={readable(licenses)}
			value={license}
		>
			{@html snarkdown(
				$_('optional_metadata.license.help').replace('{}', 'https://choosealicense.com/')
			)}
		</SelectField>

		<TextInputField
			label={$_('optional_metadata.homepage_url.label')}
			placeholder={$_('optional_metadata.homepage_url.placeholder')}
			error={is_homepage_url_error}
			value={homepage_url}
		>
			{#if $is_homepage_url_error}
				{@html snarkdown($_('optional_metadata.homepage_url.error').replace('{}', URL_PATTERN))}
			{/if}
		</TextInputField>

		<TextInputField
			label={$_('optional_metadata.source_url.label')}
			placeholder={$_('optional_metadata.source_url.placeholder')}
			error={is_source_url_error}
			value={source_url}
		>
			{#if $is_source_url_error}
				{@html snarkdown($_('optional_metadata.source_url.error').replace('{}', URL_PATTERN))}
			{/if}
		</TextInputField>

		<TextInputField
			label={$_('optional_metadata.issues_url.label')}
			placeholder={$_('optional_metadata.issues_url.placeholder')}
			error={is_issues_url_error}
			value={issues_url}
		>
			{#if $is_issues_url_error}
				{@html snarkdown($_('optional_metadata.issues_url.error').replace('{}', URL_PATTERN))}
			{/if}
		</TextInputField>
	</section>

	<div class="is-flex is-justify-content-center mb-6">
		<button
			on:click={generate_template}
			class="button is-primary is-medium"
			disabled={is_generate_button_disabled}
		>
			{$_('generate_template_button')}
		</button>
	</div>
</main>
