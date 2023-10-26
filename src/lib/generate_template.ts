import JSZip from 'jszip';
import {
	group_id_value,
	license_value,
	mod_environment_value,
	mod_id_value,
	mod_java_class_value,
	mod_name_value,
	use_mixins_value
} from './stores/field_values';
import {
	generate_build_gradle,
	generate_gradle_properties,
	generate_gradle_wrapper_properties,
	generate_java_client,
	generate_java_main,
	generate_java_mixin,
	generate_libs_versions_toml,
	generate_mit_license,
	generate_mixins_json,
	generate_quilt_mod_json,
	generate_readme_md
} from './generate_files_content';
import unlicense from '$lib/template-files/licenses/Unlicense.txt?raw';
import cc01_0 from '$lib/template-files/licenses/CC0-1.0.txt?raw';
import LGPL3 from '$lib/template-files/licenses/LGPL-3.0-only.txt?raw';
import apache2 from '$lib/template-files/licenses/Apache-2.0.txt?raw';
import MPL2 from '$lib/template-files/licenses/MPL-2.0.txt?raw';
import editorconfig from '$lib/template-files/editorconfig?raw';
import gitattributes from '$lib/template-files/gitattributes?raw';
import gitignore from '$lib/template-files/gitignore?raw';
import gradlew from '$lib/template-files/gradlew?raw';
import gradlew_bat from '$lib/template-files/gradlew-bat?raw';
import settings_gradle from '$lib/template-files/settings.gradle?raw';
import graddlewrapper_jar_url from '$lib/template-files/gradle-wrapper.jar?url';
import icon_url from '$lib/template-files/icon.png?url';

/**
 * @param file_content the imported file content
 */
async function add_static_text_file_to_folder(
	folder: JSZip,
	fileName: string,
	fileContent: string
) {
	folder.file(fileName, fileContent);
}

/**
 * @param file_url the imported file url
 */
async function add_static_binary_file_to_folder(
	foler: JSZip,
	fileName: string,
	fileUrl: string,
	fileType: string
) {
	foler.file(
		fileName,
		(
			await fetch(fileUrl, {
				method: 'GET',
				headers: {
					Accept: fileType
				}
			})
		).arrayBuffer(),
		{ binary: true }
	);
}

async function add_license_file_to_folder(folder: JSZip) {
	switch (license_value) {
		case 'MIT':
			folder.file('LICENSE', generate_mit_license());
			break;
		case 'Unlicense':
			folder.file('LICENSE', unlicense);
			break;
		case 'CC0-1.0':
			folder.file('LICENSE', cc01_0);
			break;
		case 'LGPL-3.0-only':
			folder.file('LICENSE', LGPL3);
			break;
		case 'Apache-2.0':
			folder.file('LICENSE', apache2);
			break;
		case 'MPL-2.0':
			folder.file('LICENSE', MPL2);
			break;
	}
}

export async function generate_template() {
	const root = new JSZip();

	await Promise.all([
		add_static_text_file_to_folder(root, '.editorconfig', editorconfig),
		add_static_text_file_to_folder(root, '.gitattributes', gitattributes),
		add_static_text_file_to_folder(root, '.gitignore', gitignore),
		add_static_text_file_to_folder(root, 'gradlew', gradlew),
		add_static_text_file_to_folder(root, 'gradlew.bat', gradlew_bat),
		add_static_text_file_to_folder(root, 'settings.gradle', settings_gradle),
		add_license_file_to_folder(root)
	]);

	root.file('build.gradle', generate_build_gradle());
	root.file('gradle.properties', generate_gradle_properties());
	root.file('README.md', generate_readme_md());

	const gradle_folder = root.folder('gradle');
	gradle_folder!.file('libs.versions.toml', generate_libs_versions_toml());

	const gradle_wrapper_folder = gradle_folder!.folder('wrapper');
	await add_static_binary_file_to_folder(
		gradle_wrapper_folder!,
		'gradle-wrapper.jar',
		graddlewrapper_jar_url,
		'application/java-archive'
	);
	gradle_wrapper_folder!.file('gradle-wrapper.properties', generate_gradle_wrapper_properties());

	const main_folder = root.folder('src/main');

	const mod_package = main_folder!.folder(
		`java/${group_id_value.replaceAll('.', '/')}/${mod_id_value}`
	);

	if (mod_environment_value === 'server' || mod_environment_value === 'both') {
		mod_package!.file(`${mod_java_class_value}.java`, generate_java_main());
	}

	if (mod_environment_value === 'client' || mod_environment_value === 'both') {
		const client_package = mod_package!.folder('client');
		client_package!.file(`${mod_java_class_value}Client.java`, generate_java_client());
	}

	if (use_mixins_value) {
		const mixin_package = mod_package!.folder('mixin');
		mixin_package!.file(
			`${mod_environment_value === 'server' ? 'MinecraftServerMixin' : 'TitleScreenMixin'}.java`,
			generate_java_mixin()
		);
	}

	const resources_folder = main_folder!.folder('resources');
	resources_folder!.file('quilt.mod.json', generate_quilt_mod_json());

	if (use_mixins_value) {
		resources_folder!.file(`${mod_id_value}.mixins.json`, generate_mixins_json());
	}

	const mod_assets_folder = resources_folder!.folder(`assets/${mod_id_value}`);
	await add_static_binary_file_to_folder(mod_assets_folder!, 'icon.png', icon_url, 'image/png');

	root.generateAsync({ type: 'blob' }).then((value) => {
		const a = document.createElement('a');
		a.href = URL.createObjectURL(value);
		a.download = mod_name_value.replaceAll(' ', '-').replaceAll(/[<>:/|?*]+/g, '') + '.zip';
		a.click();
	});
}
