import type { License, ModEnvironment } from '$lib/types';
import { writable, type Writable } from 'svelte/store';

export const mod_name: Writable<string> = writable();
export let mod_name_value: string;
export let mod_java_class_value: string;
mod_name.subscribe((mod_name) => {
	mod_name_value = mod_name;
	mod_java_class_value = mod_name?.replaceAll(/[^\w]|_/g, '');
});

export const mod_id: Writable<string> = writable();
export let mod_id_value: string;
mod_id.subscribe((mod_id) => (mod_id_value = mod_id));

export const group_id: Writable<string> = writable();
export let group_id_value: string;
group_id.subscribe((group_id) => (group_id_value = group_id));

export const mod_version: Writable<string> = writable();
export let mod_version_value: string;
mod_version.subscribe((mod_version) => (mod_version_value = mod_version));

export const mod_environment: Writable<ModEnvironment> = writable();
export let mod_environment_value: ModEnvironment;
mod_environment.subscribe((mod_environment) => (mod_environment_value = mod_environment));

export const minecraft_version: Writable<string> = writable();
export let minecraft_version_value: string;
minecraft_version.subscribe((minecraft_version) => (minecraft_version_value = minecraft_version));

export const is_minecraft_stable: Writable<boolean> = writable(true);
export let is_minecraft_stable_value: boolean;
is_minecraft_stable.subscribe(
	(is_minecraft_stable) => (is_minecraft_stable_value = is_minecraft_stable)
);

export const quilt_loader_version: Writable<string> = writable();
export let quilt_loader_version_value: string;
quilt_loader_version.subscribe(
	(quilt_loader_version) => (quilt_loader_version_value = quilt_loader_version)
);

export const quilt_mappings_version: Writable<string> = writable();
export let quilt_mappings_version_value: string;
quilt_mappings_version.subscribe(
	(quilt_mappings_version) => (quilt_mappings_version_value = quilt_mappings_version)
);

export const use_qsl_qfapi: Writable<boolean> = writable(true);
export let use_qsl_qfapi_value: boolean;
use_qsl_qfapi.subscribe((use_qsl_qfapi) => (use_qsl_qfapi_value = use_qsl_qfapi));

export const qsl_qfapi_version: Writable<string> = writable();
export let qsl_qfapi_version_value: string;
qsl_qfapi_version.subscribe((qsl_qfapi_version) => (qsl_qfapi_version_value = qsl_qfapi_version));

export const use_mixins: Writable<boolean> = writable(true);
export let use_mixins_value: boolean;
use_mixins.subscribe((use_mixins) => (use_mixins_value = use_mixins));

export const author: Writable<string> = writable();
export let author_value: string;
author.subscribe((author) => (author_value = author));

export const description: Writable<string> = writable();
export let description_value: string;
description.subscribe((description) => (description_value = description));

export const license: Writable<License> = writable();
export let license_value: License;
license.subscribe((license) => (license_value = license));

export const homepage_url: Writable<string> = writable();
export let homepage_url_value: string;
homepage_url.subscribe((homepage_url) => (homepage_url_value = homepage_url));

export const source_url: Writable<string> = writable();
export let source_url_value: string;
source_url.subscribe((source_url) => (source_url_value = source_url));

export const issues_url: Writable<string> = writable();
export let issues_url_value: string;
issues_url.subscribe((issues_url) => (issues_url_value = issues_url));
