import { get } from 'svelte/store';
import { get_current_gradle_version } from './get_versions';
import {
	author,
	description,
	group_id,
	homepage_url,
	icons,
	issues_url,
	license,
	minecraft_version,
	mod_environment,
	mod_id,
	mod_java_class,
	mod_name,
	mod_version,
	qsl_qfapi_version,
	quilt_loader_version,
	quilt_mappings_version,
	source_url,
	use_mixins,
	use_qsl_qfapi
} from './stores/field_values';

/**
 * @returns the content of the build.gradle file
 */
export function generate_build_gradle(): string {
	const qfapi = get(use_qsl_qfapi)
		? `\n\n\t// QSL is not a complete API; You will need Quilted Fabric API to fill in the gaps.
\t// Quilted Fabric API will automatically pull in the correct QSL version.
\tmodImplementation libs.quilted.fabric.api
\t// modImplementation libs.bundles.quilted.fabric.api // If you wish to use Fabric API's deprecated modules, you can replace the above line with this one`
		: '';

	return `plugins {
\tid 'maven-publish'
\talias libs.plugins.quilt.loom
}

base {
\tarchivesName = project.archives_base_name
}

version = "$project.version+\${libs.versions.minecraft.get()}"
group = project.maven_group

repositories {
\t// Add repositories to retrieve artifacts from in here.
\t// You should only use this when depending on other mods because
\t// Loom adds the essential maven repositories to download Minecraft and libraries from automatically.
\t// See https://docs.gradle.org/current/userguide/declaring_repositories.html
\t// for more information about repositories.
}

loom {
\t// Loom and Loader both use this block in order to gather more information about your mod.
\tmods {
\t\t// This should match your mod id.
\t\t"${get(mod_id)}" {
\t\t\t// Tell Loom about each source set used by your mod here. This ensures that your mod's classes are properly transformed by Loader.
\t\t\tsourceSet("main")
\t\t\t// If you shade (directly include classes, not JiJ) a dependency into your mod, include it here using one of these methods:
\t\t\t// dependency("com.example.shadowedmod:1.2.3")
\t\t\t// configuration("exampleShadedConfigurationName")
\t\t}
\t}
}

// All the dependencies are declared at gradle/libs.version.toml and referenced with "libs.<id>"
// See https://docs.gradle.org/current/userguide/platforms.html for information on how version catalogs work.
dependencies {
\tminecraft libs.minecraft
\tmappings variantOf(libs.quilt.mappings) { classifier 'intermediary-v2' }
\t// Replace the above line with the block below if you want to use Mojang mappings as your primary mappings, falling back on QM for parameters and Javadocs
\t/*
\tmappings loom.layered {
\t\tmappings "org.quiltmc:quilt-mappings:\${libs.versions.quilt.mappings.get()}:intermediary-v2"
\t\tofficialMojangMappings()
\t}
\t*/
\tmodImplementation libs.quilt.loader${qfapi}
}

processResources {
\tinputs.property 'version', version

\tfilesMatching('quilt.mod.json') {
\t\texpand 'version': version
\t}
}

tasks.withType(JavaCompile).configureEach {
\tit.options.encoding = 'UTF-8'
\t// Minecraft 1.18 (1.18-pre2) upwards uses Java 17.
\tit.options.release = 17
}

java {
\t// Still required by IDEs such as Eclipse and Visual Studio Code
\tsourceCompatibility = JavaVersion.VERSION_17
\ttargetCompatibility = JavaVersion.VERSION_17

\t// Loom will automatically attach sourcesJar to a RemapSourcesJar task and to the "build" task if it is present.
\t// If you remove this line, sources will not be generated.
\twithSourcesJar()

\t// If this mod is going to be a library, then it should also generate Javadocs in order to aid with development.
\t// Uncomment this line to generate them.
\t// withJavadocJar()
}

// If you plan to use a different file for the license, don't forget to change the file name here!
jar {
\tfrom('LICENSE') {
\t\trename { "\${it}_\${base.archivesName.get()}" }
\t}
}

// Configure the maven publication
publishing {
\tpublications {
\t\tmavenJava(MavenPublication) {
\t\t\tfrom components.java
\t\t}
\t}

\t// See https://docs.gradle.org/current/userguide/publishing_maven.html for information on how to set up publishing.
\trepositories {
\t\t// Add repositories to publish to here.
\t\t// Notice: This block does NOT have the same function as the block in the top level.
\t\t// The repositories here will be used for publishing your artifact, not for
\t\t// retrieving dependencies.
\t}
}
`;
}

/**
 * @returns the content of the gradle.properties file
 */
export function generate_gradle_properties(): string {
	return `# Gradle Properties
org.gradle.jvmargs = -Xmx1G
org.gradle.parallel = true

# Mod Properties
version = ${get(mod_version)}
maven_group = ${get(group_id)}
archives_base_name = ${get(mod_id)}

# Dependencies are managed at gradle/libs.versions.toml
`;
}

/**
 * @returns the content of the README.md file
 */
export function generate_readme_md(): string {
	return `# ${get(mod_name)}

This template was generated using c-leri's [Quilt Template Mod Generator](https://c-leri.github.io/quilt-template-mod-generator/)
`;
}

/**
 * @returns the content of the libs.versions.toml file
 */
export function generate_libs_versions_toml(): string {
	const qfapi_version = get(use_qsl_qfapi)
		? `\n\nquilted_fabric_api = "${get(qsl_qfapi_version)}"`
		: '';

	const qfapi_lib = get(use_qsl_qfapi)
		? `\n\nquilted_fabric_api = { module = "org.quiltmc.quilted-fabric-api:quilted-fabric-api", version.ref = "quilted_fabric_api" }
quilted_fabric_api_deprecated = { module = "org.quiltmc.quilted-fabric-api:quilted-fabric-api-deprecated", version.ref = "quilted_fabric_api" }`
		: '';

	const bundle_example = get(use_qsl_qfapi)
		? 'quilted_fabric_api = ["quilted_fabric_api", "quilted_fabric_api_deprecated"]'
		: '# example = ["example-a", "example-b", "example-c"]';

	return `[versions]
# The latest versions are available at https://lambdaurora.dev/tools/import_quilt.html
minecraft = "${get(minecraft_version)}"
quilt_mappings = "${get(quilt_mappings_version)}"
quilt_loader = "${get(quilt_loader_version)}"${qfapi_version}

[libraries]
minecraft = { module = "com.mojang:minecraft", version.ref = "minecraft" }
quilt_mappings = { module = "org.quiltmc:quilt-mappings", version.ref = "quilt_mappings" }
quilt_loader = { module = "org.quiltmc:quilt-loader", version.ref = "quilt_loader" }${qfapi_lib}

# If you have multiple similar dependencies, you can declare a dependency bundle and reference it on the build script with "libs.bundles.example".
[bundles]
${bundle_example}

[plugins]
quilt_loom = { id = "org.quiltmc.loom", version = "1.4.1" }
`;
}

/**
 * @returns the content of the gradle-wrapper.properties file
 */
export async function generate_gradle_wrapper_properties(): Promise<string> {
	const gradle_version = await get_current_gradle_version();

	return `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-${gradle_version}-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`;
}

/**
 * @returns the content of the main java class
 */
export function generate_java_main(): string {
	const initializer_import = get(use_qsl_qfapi)
		? `import org.quiltmc.loader.api.ModContainer;
import org.quiltmc.qsl.base.api.entrypoint.ModInitializer;\n`
		: '';

	const initializer_implement = get(use_qsl_qfapi) ? 'implements ModInitializer ' : '';

	const initializer_override = get(use_qsl_qfapi)
		? `\n\n\t@Override
\tpublic void onInitialize(ModContainer mod) {
\t\tLOGGER.info("Hello Quilt world from {}!", mod.metadata().name());
\t}`
		: '';

	return `package ${get(group_id)}.${get(mod_id)};

${initializer_import}import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ${get(mod_java_class)} ${initializer_implement}{
\t// This logger is used to write text to the console and the log file.
\t// It is considered best practice to use your mod name as the logger's name.
\t// That way, it's clear which mod wrote info, warnings, and errors.
\tpublic static final Logger LOGGER = LoggerFactory.getLogger("${get(
		mod_name
	)}");${initializer_override}
}
`;
}

/**
 * @returns the content of the client java class
 */
export function generate_java_client(): string {
	const initializer_import = get(use_qsl_qfapi)
		? `\nimport org.quiltmc.loader.api.ModContainer;
import org.quiltmc.qsl.base.api.entrypoint.client.ClientModInitializer;${
				get(mod_environment) !== 'client' ? '\n' : ''
		  }`
		: '';

	const logger_import =
		get(mod_environment) === 'client'
			? '\nimport org.slf4j.Logger;\nimport org.slf4j.LoggerFactory;\n'
			: '';

	const initializer_implement = get(use_qsl_qfapi) ? 'implements ClientModInitializer ' : '';

	const logger_declaration =
		get(mod_environment) === 'client'
			? `\t// This logger is used to write text to the console and the log file.
\t// It is considered best practice to use your mod name as the logger's name.
\t// That way, it's clear which mod wrote info, warnings, and errors.
\tpublic static final Logger LOGGER = LoggerFactory.getLogger("${get(mod_name)}");\n${
					get(use_qsl_qfapi) ? '\n' : ''
			  }`
			: '';

	const initializer_override = get(use_qsl_qfapi)
		? `\t@Override
\tpublic void onInitializeClient(ModContainer mod) {${
				get(mod_environment) === 'client'
					? '\n\t\tLOGGER.info("Hello Quilt world from {}!", mod.metadata().name());'
					: ''
		  }
\t}\n`
		: '';

	return `package ${get(group_id)}.${get(mod_id)}.client;
${initializer_import}${logger_import}
public class ${get(mod_java_class)}Client ${initializer_implement}{
${logger_declaration}${initializer_override}}
`;
}

/**
 * @returns the content of the mixin example java class
 */
export function generate_java_mixin(): string {
	return `package ${get(group_id)}.${get(mod_id)}.mixin;

import ${get(group_id)}.${get(mod_id)}.${
		get(mod_environment) === 'client'
			? 'client.' + get(mod_java_class) + 'Client'
			: get(mod_java_class)
	};
${
	get(mod_environment) === 'server'
		? 'import net.minecraft.server.MinecraftServer;'
		: 'import net.minecraft.client.gui.screen.TitleScreen;'
}
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

@Mixin(${get(mod_environment) === 'server' ? 'MinecraftServer' : 'TitleScreen'}.class)
public class ${get(mod_environment) === 'server' ? 'MinecraftServer' : 'TitleScreen'}Mixin {
\t@Inject(method = "${get(mod_environment) === 'server' ? 'loadWorld' : 'init'}", at = @At("TAIL"))
\tpublic void onInit(CallbackInfo ci) {
\t\t${
		get(mod_environment) === 'client' ? get(mod_java_class) + 'Client' : get(mod_java_class)
	}.LOGGER.info("This line is printed by a mixin of ${get(mod_name)}!");
\t}
}
`;
}

/**
 * @returns the content of the quilt.mod.json file
 */
export function generate_quilt_mod_json(): string {
	const description_content = get(description)
		? `,\n\t\t\t"description": "${get(description)}",`
		: '';

	let contact_content = '';
	if (get(homepage_url) || get(issues_url) || get(source_url)) {
		contact_content = ',\n\t\t\t"contact": {';

		if (get(homepage_url)) {
			contact_content += `\n\t\t\t\t"homepage": "${get(homepage_url)}"${
				get(issues_url) || get(source_url) ? ',' : ''
			}`;
		}

		if (get(issues_url)) {
			contact_content += `\n\t\t\t\t"issues": "${get(issues_url)}"${get(source_url) ? ',' : ''}`;
		}

		if (get(source_url)) {
			contact_content += `\n\t\t\t\t"sources": "${get(source_url)}"`;
		}

		contact_content += '\n\t\t\t},';
	}

	const contributors_content = get(author)
		? `,\n\t\t\t"contributors": {
\t\t\t\t"${get(author)}": "Owner"
\t\t\t},`
		: '';

	const license_content = get(license) ? `,\n\t\t\t"license": "${get(license)}"` : '';

	const icon_content =
		get(icons) && get(icons)[0] ? `,\n\t\t\t"icon": "assets/${get(mod_id)}/icon.png"` : '';

	let entrypoints_content = '';
	if (get(use_qsl_qfapi)) {
		entrypoints_content = '\n\t\t"entrypoints": {\n';
		switch (get(mod_environment)) {
			case 'client':
				entrypoints_content += `\t\t\t"client_init": "${get(group_id)}.${get(mod_id)}.client.${get(
					mod_java_class
				)}Client"\n`;
				break;
			case 'both':
				entrypoints_content += `\t\t\t"init": "${get(group_id)}.${get(mod_id)}.${get(
					mod_java_class
				)}",
\t\t\t"client_init": "${get(group_id)}.${get(mod_id)}.client.${get(mod_java_class)}Client"\n`;
				break;
			case 'server':
				entrypoints_content += `\t\t\t"init": "${get(group_id)}.${get(mod_id)}.${get(
					mod_java_class
				)}"\n`;
				break;
		}
		entrypoints_content += '\t\t},';
	}

	const qfapi_content = get(use_qsl_qfapi)
		? `\n\t\t\t{
\t\t\t\t"id": "quilted_fabric_api",
\t\t\t\t"versions": ">=${get(qsl_qfapi_version).replace(/-.+/g, '-')}"
\t\t\t},`
		: '';

	const mixin_content = get(use_mixins) ? `\n\t"mixin": "${get(mod_id)}.mixins.json",` : '';

	return `{
\t"schema_version": 1,
\t"quilt_loader": {
\t\t"group": "${get(group_id)}",
\t\t"id": "${get(mod_id)}",
\t\t"version": "\${version}",
\t\t"metadata": {
\t\t\t"name": "${get(
		mod_name
	)}"${description_content}${contact_content}${contributors_content}${license_content}${icon_content}
\t\t},
\t\t"intermediate_mappings": "net.fabricmc:intermediary",${entrypoints_content}
\t\t"depends": [
\t\t\t{
\t\t\t\t"id": "quilt_loader",
\t\t\t\t"versions": ">=${get(quilt_loader_version).replace(/-.+/g, '-')}"
\t\t\t},${qfapi_content}
\t\t\t{
\t\t\t\t"id": "minecraft",
\t\t\t\t"versions": "~${get(minecraft_version)}"
\t\t\t}
\t\t]
\t},${mixin_content}
\t"minecraft": {
\t\t"environment": "${
		get(mod_environment) === 'both'
			? '*'
			: get(mod_environment) === 'server'
			? 'dedicated_server'
			: 'client'
	}"
\t}
}
`;
}

/**
 * @returns the content of the <MOD_ID>.mixins.json file
 */
export function generate_mixins_json(): string {
	return `{
"required": true,
"minVersion": "0.8",
"package": "${get(group_id)}.${get(mod_id)}.mixin",
"compatibilityLevel": "JAVA_17",
"mixins": [],
"client": [${get(mod_environment) !== 'server' ? '\n    "TitleScreenMixin"\n  ' : ''}],
"server": [${get(mod_environment) === 'server' ? '\n    "MinecraftServerMixin"\n  ' : ''}],
"injectors": {
	"defaultRequire": 1
}
}    
`;
}

/**
 * @returns the content of the MIT Licnese
 */
export function generate_mit_license(): string {
	return `MIT License

Copyright (c) ${new Date().getFullYear()} ${get(author) ? get(author) : '<copyright holders>'}

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice (including the next paragraph) shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
`;
}

/**
 * @returns the content of the ISC Licnese
 */
export function generate_isc_license(): string {
	return `ISC License

Copyright (c) ${new Date().getFullYear()} ${get(author) ? get(author) : '<copyright holders>'}

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
`;
}
