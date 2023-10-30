export const GENERIC_JSON_INVALID_CHARACTERS = '"\\$';
export const GENERIC_JSON_VALIDATOR = new RegExp(
	`[${GENERIC_JSON_INVALID_CHARACTERS.replace('\\', '\\\\')}]`
);

export const MOD_ID_VALID_CHARACTERS = 'a-z0-9_';
export const MOD_ID_VALIDATOR = new RegExp(`[^${MOD_ID_VALID_CHARACTERS}]`);

export const GROUP_ID_VALID_CHARACTERS = 'a-z0-9_.';
export const GROUP_ID_VALIDATOR = new RegExp(`[^${GROUP_ID_VALID_CHARACTERS}]`);

export const MOD_VERSION_VALID_CHARACTERS = 'a-z0-9_.+-';
export const MOD_VERSION_VALIDATOR = new RegExp(`[^${MOD_VERSION_VALID_CHARACTERS}]`);

export const URL_PATTERN = '<http OR https>://<DOMAIN>/<PATH>';
export const URL_VALIDATOR = /https?:\/\/[a-z0-9+-.](\/[[a-z0-9+-])*/i;

export const QKL_VERSION_VALIDATOR = /.+\+kt.+\+flk.+/;
export const KOTLIN_VERSION_EXTRACTOR = /\+kt\.(.+)\+/;
