import type { SelectOption } from '$lib/types';
import { writable, type Writable } from 'svelte/store';
import { is_minecraft_stable, minecraft_version } from './field_values';
import {
	get_minecraft_versions,
	get_qsl_qfapi_versions,
	get_quilt_loader_versions,
	get_quilt_mappings_versions
} from '$lib/get_versions';
import {
	is_minecraft_version_error,
	is_qsl_qfapi_version_error,
	is_quilt_loader_version_error,
	is_quilt_mappings_version_error
} from './field_errors';

export const minecraft_versions: Writable<SelectOption[] | undefined> = writable();
export const quilt_loader_versions: Writable<SelectOption[] | undefined> = writable();
export const quilt_mappings_versions: Writable<SelectOption[] | undefined> = writable();
export const qsl_qfapi_versions: Writable<SelectOption[] | undefined> = writable();

is_minecraft_stable.subscribe(() => {
	minecraft_versions.set(undefined);
	get_minecraft_versions()
		.then(($minecraft_versions) => {
			is_minecraft_version_error.set(false);
			minecraft_versions.set($minecraft_versions);
		})
		.catch(() => is_minecraft_version_error.set(true));
});

minecraft_version.subscribe(($minecraft_version) => {
	if ($minecraft_version) {
		quilt_loader_versions.set(undefined);
		get_quilt_loader_versions()
			.then(($quilt_loader_versions) => {
				is_quilt_loader_version_error.set(false);
				quilt_loader_versions.set($quilt_loader_versions);
			})
			.catch(() => is_quilt_loader_version_error.set(true));

		quilt_mappings_versions.set(undefined);
		get_quilt_mappings_versions()
			.then(($quilt_mappings_versions) => {
				is_quilt_mappings_version_error.set(false);
				quilt_mappings_versions.set($quilt_mappings_versions);
			})
			.catch(() => is_quilt_mappings_version_error.set(true));

		qsl_qfapi_versions.set(undefined);
		get_qsl_qfapi_versions()
			.then(($qsl_qfapi_versions) => {
				is_qsl_qfapi_version_error.set(false);
				qsl_qfapi_versions.set($qsl_qfapi_versions);
			})
			.catch(() => is_qsl_qfapi_version_error.set(true));
	}
});
