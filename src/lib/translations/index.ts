import i18n from '@sveltekit-i18n/base';
import type { Config } from '@sveltekit-i18n/parser-default';
import lang from './lang.json';
import parser from '@sveltekit-i18n/parser-default';

export const config: Config<{ placeholder?: string }> = {
	initLocale: 'en',
	fallbackLocale: 'en',
	parser: parser(),
	translations: {
		en: { lang },
		fr: { lang }
	},
	loaders: [
		{
			locale: 'en',
			key: 'general',
			loader: async () => (await import('./en/general.json')).default
		},
		{
			locale: 'en',
			key: 'select_options',
			loader: async () => (await import('./en/select_options.json')).default
		},
		{
			locale: 'en',
			key: 'mod_configuration',
			loader: async () => (await import('./en/mod_configuration.json')).default
		},
		{
			locale: 'en',
			key: 'dependencies_configuration',
			loader: async () => (await import('./en/dependencies_configuration.json')).default
		},
		{
			locale: 'en',
			key: 'optional_metadata',
			loader: async () => (await import('./en/optional_metadata.json')).default
		},
		{
			locale: 'fr',
			key: 'general',
			loader: async () => (await import('./fr/general.json')).default
		},
		{
			locale: 'fr',
			key: 'select_options',
			loader: async () => (await import('./fr/select_options.json')).default
		},
		{
			locale: 'fr',
			key: 'mod_configuration',
			loader: async () => (await import('./fr/mod_configuration.json')).default
		},
		{
			locale: 'fr',
			key: 'dependencies_configuration',
			loader: async () => (await import('./fr/dependencies_configuration.json')).default
		},
		{
			locale: 'fr',
			key: 'optional_metadata',
			loader: async () => (await import('./fr/optional_metadata.json')).default
		}
	]
};

export const { t, loading, locales, locale, loadTranslations } = new i18n(config);
