export interface Option {
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
