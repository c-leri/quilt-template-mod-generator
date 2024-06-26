import JSZip from 'jszip';
import {
	group_id,
	icons,
	license,
	mod_environment,
	mod_id,
	mod_java_class,
	mod_name,
	use_mixins,
	use_qkl
} from './stores/field_values';
import {
	generate_build_gradle,
	generate_gradle_properties,
	generate_gradle_wrapper_properties,
	generate_isc_license,
	generate_java_client,
	generate_java_main,
	generate_java_mixin,
	generate_kotlin_client,
	generate_kotlin_main,
	generate_libs_versions_toml,
	generate_mit_license,
	generate_mixins_json,
	generate_quilt_mod_json,
	generate_readme_md,
	generate_settings_gradle_kts,
	generate_settings_gradle
} from './generate_files_content';
import { get } from 'svelte/store';
import type { StaticTextFiles } from './types';

async function add_license_file_to_folder(folder: JSZip) {
	let license_content = '';

	if (get(license) === 'MIT') {
		license_content = generate_mit_license();
	} else if (get(license) === 'ISC') {
		license_content = generate_isc_license();
	} else if (get(license)) {
		console.log(get(license));
		license_content = (await import(`$lib/template-files/licenses/${get(license)}.txt?raw`))
			.default;
	}

	if (license_content) {
		folder.file('LICENSE', license_content);
	}
}

async function add_static_file_to_foler(folder: JSZip, fileName: StaticTextFiles) {
	folder.file(
		fileName,
		(await import(`$lib/template-files/${fileName.replaceAll('.', '')}.txt?raw`)).default
	);
}

export async function generate_template() {
	const root = new JSZip();

	await Promise.all([
		add_static_file_to_foler(root, '.editorconfig'),
		add_static_file_to_foler(root, '.gitattributes'),
		add_static_file_to_foler(root, '.gitignore'),
		add_static_file_to_foler(root, 'gradlew.bat'),
		add_static_file_to_foler(root, 'gradlew'),
		add_license_file_to_folder(root)
	]);

	if (get(use_qkl)) {
		root.file('settings.gradle.kts', generate_settings_gradle_kts());
		await add_static_file_to_foler(root, 'build.gradle.kts');
	} else {
		root.file('settings.gradle', generate_settings_gradle());
		root.file('build.gradle', generate_build_gradle());
	}

	root.file('gradle.properties', generate_gradle_properties());
	root.file('README.md', generate_readme_md());

	const gradle_folder = root.folder('gradle');
	gradle_folder?.file('libs.versions.toml', generate_libs_versions_toml());

	const gradle_wrapper_folder = gradle_folder?.folder('wrapper');
	gradle_wrapper_folder?.file(
		'gradle-wrapper.jar',
		(
			await fetch((await import('$lib/template-files/gradle-wrapper.jar?url')).default, {
				method: 'GET',
				headers: {
					Accept: 'application/java-archive'
				}
			})
		).arrayBuffer(),
		{ binary: true }
	);

	gradle_wrapper_folder?.file('gradle-wrapper.properties', generate_gradle_wrapper_properties());

	const main_folder = root.folder('src/main');

	if (!get(use_qkl) || get(use_mixins)) {
		const java_mod_package = main_folder?.folder(
			`java/${get(group_id).replaceAll('.', '/')}/${get(mod_id)}`
		);

		if (!get(use_qkl)) {
			if (get(mod_environment) === 'server' || get(mod_environment) === 'both') {
				java_mod_package?.file(`${get(mod_java_class)}.java`, generate_java_main());
			}

			if (get(mod_environment) === 'client' || get(mod_environment) === 'both') {
				const client_package = java_mod_package?.folder('client');
				client_package?.file(`${get(mod_java_class)}Client.java`, generate_java_client());
			}
		}

		if (get(use_mixins)) {
			const mixin_package = java_mod_package?.folder('mixin');
			mixin_package?.file(
				`${get(mod_environment) === 'server' ? 'MinecraftServerMixin' : 'TitleScreenMixin'}.java`,
				generate_java_mixin()
			);
		}
	}

	if (get(use_qkl)) {
		const kotlin_mod_package = main_folder?.folder(
			`kotlin/${get(group_id).replaceAll('.', '/')}/${get(mod_id)}`
		);

		if (get(mod_environment) === 'server' || get(mod_environment) === 'both') {
			kotlin_mod_package?.file(`${get(mod_java_class)}.kt`, generate_kotlin_main());
		}

		if (get(mod_environment) === 'client' || get(mod_environment) === 'both') {
			const client_package = kotlin_mod_package?.folder('client');
			client_package?.file(`${get(mod_java_class)}Client.kt`, generate_kotlin_client());
		}
	}

	const resources_folder = main_folder?.folder('resources');
	resources_folder?.file('quilt.mod.json', generate_quilt_mod_json());

	if (get(use_mixins)) {
		resources_folder?.file(`${get(mod_id)}.mixins.json`, generate_mixins_json());
	}

	if (get(icons) && get(icons)[0]) {
		const mod_assets_folder = resources_folder?.folder(`assets/${get(mod_id)}`);
		mod_assets_folder?.file('icon.png', get(icons)[0].arrayBuffer(), { binary: true });
	}

	root.generateAsync({ type: 'blob' }).then((value) => {
		const a = document.createElement('a');
		a.href = URL.createObjectURL(value);
		a.download =
			get(mod_name)
				.replaceAll(' ', '-')
				.replaceAll(/[<>:/|?*]+/g, '') + '.zip';
		a.click();
	});
}
