import { get } from 'svelte/store';
import type {
	GradleVersion,
	MinecraftVersion,
	SelectOption,
	QuiltLoaderVersion,
	QuiltMappingsVersion
} from './types';
import { is_minecraft_stable, minecraft_version } from './stores/field_values';

const QUILT_META = 'https://meta.quiltmc.org/v3/versions';

/**
 * @throws {Error}
 */
export async function get_minecraft_versions(): Promise<SelectOption[]> {
	const url = QUILT_META + '/game';
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Accept: 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error('Got invalid response when fetching minecraft versions');
	}

	let response_body: MinecraftVersion[] = await response.json();

	if (get(is_minecraft_stable)) {
		response_body = response_body.filter((minecraft_version) => minecraft_version.stable);
	}

	// Removes the versions orior to 1.18.2 as there is no quilt mappings for them
	const version_1_18_2_index = response_body.findIndex(
		(minecraft_version) => minecraft_version.version === '1.18.2'
	);

	return response_body.slice(0, version_1_18_2_index + 1).map((minecraft_version) => {
		return { name: minecraft_version.version };
	});
}

/**
 * @throws {Error}
 */
export async function get_quilt_loader_versions(): Promise<SelectOption[]> {
	if (!get(minecraft_version)) {
		throw new Error("Can't fetch Quilt Loader vesions without a minecraft version");
	}

	const url = `${QUILT_META}/loader/${get(minecraft_version)}`;
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Accept: 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error('Got invalid response when fetching Quilt Loader versions');
	}

	const response_body: QuiltLoaderVersion[] = await response.json();

	return response_body.map((quilt_loader_versions) => {
		return { name: quilt_loader_versions.loader.version };
	});
}

/**
 * @throws {Error}
 */
export async function get_quilt_mappings_versions(): Promise<SelectOption[]> {
	const url = `${QUILT_META}/quilt-mappings/${get(minecraft_version)}`;
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Accept: 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error('Got invalid response when fetching Quilt Mappings versions');
	}

	const response_body: QuiltMappingsVersion[] = await response.json();

	return response_body.map((version) => {
		return { name: version.version.replace(/.+\+build\./, ''), value: version.version };
	});
}

/**
 * @throws {Error}
 */
export async function get_qsl_qfapi_versions(): Promise<SelectOption[]> {
	if (!get(minecraft_version)) {
		throw new Error("Can't fetch QSL/QFAPI vesions without a minecraft version");
	}

	const url =
		'https://maven.quiltmc.org/repository/release/org/quiltmc/quilted-fabric-api/quilted-fabric-api/maven-metadata.xml';
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Accept: 'application/xml'
		}
	});

	if (!response.ok) {
		throw new Error('Got invalid response when fetching QSL/QFAPI versions');
	}

	const response_body = await response.text();

	const parser = new DOMParser();
	const qsl_qfapi_version = Array.from(
		parser.parseFromString(response_body, 'text/xml').getElementsByTagName('version')
	).map((version_element) => version_element.textContent);

	return qsl_qfapi_version
		.filter((version) => version !== null && version.endsWith(get(minecraft_version)))
		.map((version) => {
			return { name: version!.replace(`-${get(minecraft_version)}`, ''), value: version! };
		})
		.reverse();
}

export async function get_current_gradle_version(): Promise<string> {
	const url = 'https://services.gradle.org/versions/current';
	const reponse = await fetch(url, {
		method: 'GET',
		headers: {
			Accept: 'application/json'
		}
	});

	if (!reponse.ok) {
		throw new Error('Got invalid response when fetching current gradle version');
	}

	const reponse_body: GradleVersion = await reponse.json();

	return reponse_body.version;
}
