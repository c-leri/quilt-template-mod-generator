export interface SelectOption {
	name: string;
	value?: string;
	translatable?: boolean;
}

export interface MinecraftVersion {
	version: string;
	stable: boolean;
}

export interface QuiltLoaderVersion {
	loader: {
		version: string;
	};
}

export interface QuiltMappingsVersion {
	version: string;
}

export interface ModrinthProjectVersion {
	name: string;
	version_number: string;
	version_type: 'release' | 'beta' | 'alpha';
	game_versions: string[];
}

export interface GradleVersion {
	version: string;
}

export type ModEnvironment = 'client' | 'both' | 'server';

export type License =
	| ''
	| 'CC0-1.0'
	| 'Unlicense'
	| 'BSL-1.0'
	| 'MIT'
	| 'ISC'
	| 'Apache-2.0'
	| 'MPL-2.0'
	| 'LGPL-3.0-only';

export type StaticTextFiles =
	| '.editorconfig'
	| '.gitattributes'
	| '.gitignore'
	| 'gradlew.bat'
	| 'gradlew'
	| 'settings.gradle'
	| 'build.gradle.kts';
