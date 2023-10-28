import type { License, ModEnvironment } from '$lib/types';
import { derived, writable, type Readable, type Writable } from 'svelte/store';

export const mod_name: Writable<string> = writable();
export const mod_java_class: Readable<string> = derived(mod_name, ($mod_name) =>
	$mod_name?.replaceAll(/[^\w]|_/g, '')
);
export const mod_id: Writable<string> = writable();
export const group_id: Writable<string> = writable();
export const mod_version: Writable<string> = writable();
export const mod_environment: Writable<ModEnvironment> = writable();
export const minecraft_version: Writable<string> = writable();
export const is_minecraft_stable: Writable<boolean> = writable(true);
export const quilt_loader_version: Writable<string> = writable();
export const quilt_mappings_version: Writable<string> = writable();
export const use_qsl_qfapi: Writable<boolean> = writable(true);
export const qsl_qfapi_version: Writable<string> = writable();
export const use_mixins: Writable<boolean> = writable(true);
export const icons: Writable<File[]> = writable();
export const author: Writable<string> = writable();
export const description: Writable<string> = writable();
export const license: Writable<License> = writable();
export const homepage_url: Writable<string> = writable();
export const source_url: Writable<string> = writable();
export const issues_url: Writable<string> = writable();
