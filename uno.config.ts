import { defineConfig, presetIcons } from 'unocss';

export default defineConfig({
	presets: [
		presetIcons({
			collections: {
				'fa6-solid': () => import('@iconify-json/fa6-solid/icons.json').then((i) => i.default),
				'fa6-brands': () => import('@iconify-json/fa6-brands/icons.json').then((i) => i.default)
			}
		})
	],
	rules: [
		// Replicates fontawesome's "fa-xl"
		['i-xl', { 'font-size': '1.5em' }],
		['i-2xl', { 'font-size': '2em' }]
	]
});
