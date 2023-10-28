<script lang="ts">
	import snarkdown from 'snarkdown';
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
	import { readable } from 'svelte/store';
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
		is_qsl_qfapi_version_error,
		is_icon_error
	} from '$lib/stores/field_errors';
	import { licenses, mod_environments } from '$lib/constants/select_options';
	import { generate_template } from '$lib/generate_template';
	import { t } from '$lib/translations';
	import IconInputField from '$lib/components/IconInputField.svelte';
	import {
		minecraft_versions,
		qsl_qfapi_versions,
		quilt_loader_versions,
		quilt_mappings_versions
	} from '$lib/stores/select_options';

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
		$is_icon_error ||
		$is_author_error ||
		$is_description_error ||
		$is_homepage_url_error ||
		$is_source_url_error ||
		$is_issues_url_error;
</script>

<main>
	<section class="section">
		<h1 class="title has-text-centered">{$t('mod_configuration.title')}</h1>

		<TextInputField
			label={$t('mod_configuration.mod_name.label')}
			placeholder={$t('mod_configuration.mod_name.placeholder')}
			error={is_mod_name_error}
			value={mod_name}
			required
		>
			{#if $is_mod_name_error}
				{@html snarkdown(
					$t('mod_configuration.mod_name.error', {
						placeholder: GENERIC_JSON_INVALID_CHARACTERS
					})
				)}
			{/if}
		</TextInputField>

		<TextInputField
			label={$t('mod_configuration.mod_id.label')}
			placeholder={$t('mod_configuration.mod_id.placeholder')}
			error={is_mod_id_error}
			value={mod_id}
			required
		>
			{#if $is_mod_id_error}
				{@html snarkdown(
					$t('mod_configuration.mod_id.error', {
						placeholder: MOD_ID_VALID_CHARACTERS
					})
				)}
			{/if}
		</TextInputField>

		<TextInputField
			label={$t('mod_configuration.group_id.label')}
			placeholder={$t('mod_configuration.group_id.placeholder')}
			error={is_group_id_error}
			value={group_id}
			required
		>
			{#if $is_group_id_error}
				{@html snarkdown(
					$t('mod_configuration.group_id.error', {
						placeholder: GROUP_ID_VALID_CHARACTERS
					})
				)}
			{:else}
				{@html snarkdown($t('mod_configuration.group_id.help'))}
			{/if}
		</TextInputField>

		<TextInputField
			label={$t('mod_configuration.mod_version.label')}
			placeholder={$t('mod_configuration.mod_version.placeholder')}
			error={is_mod_version_error}
			value={mod_version}
			required
		>
			{#if $is_mod_version_error}
				{@html snarkdown(
					$t('mod_configuration.mod_version.error', {
						placeholder: MOD_VERSION_VALID_CHARACTERS
					})
				)}
			{/if}
		</TextInputField>

		<SelectField
			label={$t('mod_configuration.mod_environment.label')}
			options={readable(mod_environments)}
			value={mod_environment}
			required
		/>
	</section>

	<section class="section">
		<h1 class="title has-text-centered">{$t('dependencies_configuration.title')}</h1>

		<SelectField
			label={$t('dependencies_configuration.minecraft_version.label')}
			options={minecraft_versions}
			value={minecraft_version}
			error={is_minecraft_version_error}
			required
		>
			{#if $is_minecraft_version_error}
				{$t('dependencies_configuration.minecraft_version.error')}
			{/if}
		</SelectField>

		<CheckboxField
			label={$t('dependencies_configuration.minecraft_stable.label')}
			checked={is_minecraft_stable}
		/>

		<SelectField
			label={$t('dependencies_configuration.quilt_loader_version.label')}
			options={quilt_loader_versions}
			error={is_quilt_loader_version_error}
			value={quilt_loader_version}
			required
		>
			{#if $is_quilt_loader_version_error}
				{$minecraft_version
					? $t('dependencies_configuration.quilt_loader_version.error.with_minecraft_version', {
							placeholder: $minecraft_version
					  })
					: $t('dependencies_configuration.quilt_loader_version.error.without_minecraft_version')}
			{:else if !$quilt_loader_versions?.length}
				{$minecraft_version
					? $t(
							'dependencies_configuration.quilt_loader_version.no_versions.with_minecraft_version',
							{
								placeholder: $minecraft_version
							}
					  )
					: $t(
							'dependencies_configuration.quilt_loader_version.no_versions.without_minecraft_version'
					  )}
			{/if}
		</SelectField>

		<SelectField
			label={$t('dependencies_configuration.quilt_mappings_version.label')}
			options={quilt_mappings_versions}
			value={quilt_mappings_version}
			error={is_quilt_mappings_version_error}
			required
		>
			{#if $is_quilt_mappings_version_error}
				{$minecraft_version
					? $t('dependencies_configuration.quilt_mappings_version.error.with_minecraft_version', {
							placeholder: $minecraft_version
					  })
					: $t('dependencies_configuration.quilt_mappings_version.error.without_minecraft_version')}
			{:else if !$quilt_mappings_versions?.length}
				{$minecraft_version
					? $t(
							'dependencies_configuration.quilt_mappings_version.no_versions.with_minecraft_version',
							{
								placeholder: $minecraft_version
							}
					  )
					: $t(
							'dependencies_configuration.quilt_mappings_version.no_versions.without_minecraft_version'
					  )}
			{/if}
		</SelectField>

		<CheckboxField
			label={$t('dependencies_configuration.use_qsl_qfapi.label')}
			checked={use_qsl_qfapi}
		/>

		{#if $use_qsl_qfapi}
			<SelectField
				label={$t('dependencies_configuration.qsl_qfapi_version.label')}
				options={qsl_qfapi_versions}
				value={qsl_qfapi_version}
				error={is_qsl_qfapi_version_error}
				required
			>
				{#if $is_qsl_qfapi_version_error}
					{$minecraft_version
						? $t('dependencies_configuration.qsl_qfapi_version.error.with_minecraft_version', {
								placeholder: $minecraft_version
						  })
						: $t('dependencies_configuration.qsl_qfapi_version.error.without_minecraft_version')}
				{:else if !$qsl_qfapi_versions?.length}
					{$minecraft_version
						? $t(
								'dependencies_configuration.qsl_qfapi_version.no_versions.with_minecraft_version',
								{
									placeholder: $minecraft_version
								}
						  )
						: $t(
								'dependencies_configuration.qsl_qfapi_version.no_versions.without_minecraft_version'
						  )}
				{/if}
			</SelectField>
		{/if}

		<CheckboxField label={$t('dependencies_configuration.use_mixins.label')} checked={use_mixins} />
	</section>

	<section class="section">
		<h1 class="title has-text-centered">{$t('optional_metadata.title')}</h1>

		<IconInputField />

		<TextInputField
			label={$t('optional_metadata.author.label')}
			placeholder={$t('optional_metadata.author.placeholder')}
			error={is_author_error}
			value={author}
		>
			{#if $is_author_error}
				{@html snarkdown(
					$t('optional_metadata.author.error', {
						placeholder: GENERIC_JSON_INVALID_CHARACTERS
					})
				)}
			{/if}
		</TextInputField>

		<TextAreaField
			label={$t('optional_metadata.description.label')}
			placeholder={$t('optional_metadata.description.placeholder')}
			error={is_description_error}
			value={description}
		>
			{#if $is_description_error}
				{@html snarkdown(
					$t('optional_metadata.description.error', {
						placeholder: GENERIC_JSON_INVALID_CHARACTERS
					})
				)}
			{/if}
		</TextAreaField>

		<SelectField
			label={$t('optional_metadata.license.label')}
			options={readable(licenses)}
			value={license}
		>
			{@html snarkdown(
				$t('optional_metadata.license.help', { placeholder: 'https://choosealicense.com/' })
			)}
		</SelectField>

		<TextInputField
			label={$t('optional_metadata.homepage_url.label')}
			placeholder={$t('optional_metadata.homepage_url.placeholder')}
			error={is_homepage_url_error}
			value={homepage_url}
		>
			{#if $is_homepage_url_error}
				{@html snarkdown(
					$t('optional_metadata.homepage_url.error', {
						placeholder: URL_PATTERN
					})
				)}
			{/if}
		</TextInputField>

		<TextInputField
			label={$t('optional_metadata.source_url.label')}
			placeholder={$t('optional_metadata.source_url.placeholder')}
			error={is_source_url_error}
			value={source_url}
		>
			{#if $is_source_url_error}
				{@html snarkdown(
					$t('optional_metadata.source_url.error', {
						placeholder: URL_PATTERN
					})
				)}
			{/if}
		</TextInputField>

		<TextInputField
			label={$t('optional_metadata.issues_url.label')}
			placeholder={$t('optional_metadata.issues_url.placeholder')}
			error={is_issues_url_error}
			value={issues_url}
		>
			{#if $is_issues_url_error}
				{@html snarkdown(
					$t('optional_metadata.issues_url.error', {
						placeholder: URL_PATTERN
					})
				)}
			{/if}
		</TextInputField>
	</section>

	<div class="is-flex is-justify-content-center mb-6">
		<button
			on:click={generate_template}
			class="button is-primary is-medium"
			disabled={is_generate_button_disabled}
		>
			{$t('general.generate_template_button')}
		</button>
	</div>
</main>
