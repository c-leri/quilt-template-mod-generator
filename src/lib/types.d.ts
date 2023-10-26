export interface SelectOption {
	name: string;
	value?: string;
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

export interface GradleVersion {
	version: string;
}

export type ModEnvironment = 'client' | 'both' | 'server';

export type License =
	| ''
	| 'Unlicense'
	| 'CC0-1.0'
	| 'LGPL-3.0-only'
	| 'MIT'
	| 'Apache-2.0'
	| 'MPL-2.0';
