import { writable, type Writable } from 'svelte/store';
import {
	author,
	description,
	group_id,
	homepage_url,
	icons,
	issues_url,
	mod_id,
	mod_name,
	mod_version,
	source_url
} from './field_values';
import {
	GENERIC_JSON_VALIDATOR,
	GROUP_ID_VALIDATOR,
	MOD_ID_VALIDATOR,
	MOD_VERSION_VALIDATOR,
	URL_VALIDATOR
} from '$lib/constants/regex';

export const is_minecraft_version_error: Writable<boolean> = writable(false);
export const is_quilt_loader_version_error: Writable<boolean> = writable(false);
export const is_quilt_mappings_version_error: Writable<boolean> = writable(false);
export const is_qsl_qfapi_version_error: Writable<boolean> = writable(false);
export const is_qkl_version_error: Writable<boolean> = writable(false);

export const is_mod_name_error: Writable<boolean> = writable(false);
mod_name.subscribe((mod_name) =>
	is_mod_name_error.set(mod_name !== undefined && GENERIC_JSON_VALIDATOR.test(mod_name))
);

export const is_mod_id_error: Writable<boolean> = writable(false);
mod_id.subscribe((mod_id) =>
	is_mod_id_error.set(mod_id !== undefined && MOD_ID_VALIDATOR.test(mod_id))
);

export const is_group_id_error: Writable<boolean> = writable(false);
group_id.subscribe((group_id) =>
	is_group_id_error.set(group_id !== undefined && GROUP_ID_VALIDATOR.test(group_id))
);

export const is_mod_version_error: Writable<boolean> = writable(false);
mod_version.subscribe((mod_version) =>
	is_mod_version_error.set(mod_version !== undefined && MOD_VERSION_VALIDATOR.test(mod_version))
);

export const is_icon_error: Writable<boolean> = writable(false);
icons.subscribe((icons) => {
	if (icons && icons[0]) {
		if (icons[0].type != 'image/png') {
			is_icon_error.set(true);
		} else {
			const img = new Image();
			const iconUrl = URL.createObjectURL(icons[0]);
			img.onload = () => {
				is_icon_error.set(img.width !== img.height);
			};
			img.src = iconUrl;
		}
	} else {
		is_icon_error.set(false);
	}
});

export const is_author_error: Writable<boolean> = writable(false);
author.subscribe((author) =>
	is_author_error.set(author !== undefined && GENERIC_JSON_VALIDATOR.test(author))
);

export const is_description_error: Writable<boolean> = writable(false);
description.subscribe((description) =>
	is_description_error.set(description !== undefined && GENERIC_JSON_VALIDATOR.test(description))
);

export const is_homepage_url_error: Writable<boolean> = writable(false);
homepage_url.subscribe((homepage_url) =>
	is_homepage_url_error.set(homepage_url !== undefined && !URL_VALIDATOR.test(homepage_url))
);

export const is_source_url_error: Writable<boolean> = writable(false);
source_url.subscribe((source_url) =>
	is_source_url_error.set(source_url !== undefined && !URL_VALIDATOR.test(source_url))
);

export const is_issues_url_error: Writable<boolean> = writable(false);
issues_url.subscribe((issues_url) =>
	is_issues_url_error.set(issues_url !== undefined && !URL_VALIDATOR.test(issues_url))
);
