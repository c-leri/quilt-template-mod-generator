import type {
	GradleVersion,
	MinecraftVersion,
	Option,
	QuiltLoaderVersion,
	QuiltMappingsVersion
} from './types';

const QUILT_META = 'https://meta.quiltmc.org/v3/versions';

/**
 * @throws {Error}
 */
export async function get_minecraft_versions(stable: boolean): Promise<Option[]> {
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

	if (stable) {
		response_body = response_body.filter((minecraft_versions) => minecraft_versions.stable);
	}

	return response_body.map((minecraft_versions) => {
		return { name: minecraft_versions.version };
	});
}

/**
 * @throws {Error}
 */
export async function get_quilt_loader_versions(minecraft_version: string): Promise<Option[]> {
	if (!minecraft_version) {
		throw new Error("Can't fetch Quilt Loader vesions without a minecraft version");
	}

	const url = `${QUILT_META}/loader/${minecraft_version}`;
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
export async function get_quilt_mappings_versions(minecraft_version: string): Promise<Option[]> {
	const url = `${QUILT_META}/quilt-mappings/${minecraft_version}`;
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
export async function get_qsl_qfapi_versions(minecraft_version: string): Promise<Option[]> {
	if (!minecraft_version) {
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
		.filter((version) => version !== null && version.endsWith(minecraft_version))
		.map((version) => {
			return { name: version!.replace(`-${minecraft_version}`, ''), value: version! };
		})
		.toReversed();
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
