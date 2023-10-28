<script lang="ts">
	import { is_icon_error } from '$lib/stores/field_errors';
	import { icons } from '$lib/stores/field_values';
	import { t } from '$lib/translations';

	let files: FileList;
	let file_input: HTMLInputElement;

	$: if (files) {
		$icons = Array.from(files);
	}

	const id = crypto.randomUUID();
</script>

<div class="field">
	<label class="label is-medium" for={id}>{$t('optional_metadata.icon.label')}</label>
	<div class="control is-flex">
		<div class="file is-medium {$icons && $icons[0] && 'has-name'}">
			<label class="file-label">
				<input
					class="file-input"
					type="file"
					accept="image/png"
					bind:files
					bind:this={file_input}
					{id}
				/>
				<span class="file-cta">
					<span class="file-icon">
						<i class="fas fa-upload" />
					</span>
					<span class="file-label">{$t('optional_metadata.icon.call_to_action')}</span>
				</span>

				{#if $icons && $icons[0]}
					<span class="file-name">{$icons[0].name}</span>
				{/if}
			</label>
		</div>

		{#if $icons && $icons[0]}
			<button
				class="button is-danger is-outlined is-medium ml-3"
				id="delete"
				on:click={() => {
					file_input.value = '';
					$icons = [];
				}}
			>
				<span class="icon">
					<i class="fas fa-times" />
				</span>
			</button>
		{/if}
	</div>
	{#if $is_icon_error}
		<p class="help is-medium is-danger">
			{$t('optional_metadata.icon.error')}
		</p>
	{/if}
</div>

<style>
	.file-cta,
	.file-label:hover .file-cta {
		color: #271f33;
	}

	.help {
		font-size: 1rem;
		opacity: 0.8;
	}

	#delete {
		border-radius: 1.5rem;
	}
</style>
