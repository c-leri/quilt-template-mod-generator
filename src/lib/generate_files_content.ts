import { get_current_gradle_version } from './get_versions';
import {
	author_value,
	description_value,
	group_id_value,
	homepage_url_value,
	issues_url_value,
	license_value,
	minecraft_version_value,
	mod_environment_value,
	mod_id_value,
	mod_java_class_value,
	mod_name_value,
	mod_version_value,
	qsl_qfapi_version_value,
	quilt_loader_version_value,
	quilt_mappings_version_value,
	source_url_value,
	use_mixins_value,
	use_qsl_qfapi_value
} from './stores/field_values';

/**
 * @returns the content of the build.gradle file
 */
export function generate_build_gradle(): string {
	const qfapi = use_qsl_qfapi_value
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
\t\t"${mod_id_value}" {
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
version = ${mod_version_value}
maven_group = ${group_id_value}
archives_base_name = ${mod_id_value}

# Dependencies are managed at gradle/libs.versions.toml
`;
}

/**
 * @returns the content of the README.md file
 */
export function generate_readme_md(): string {
	return `# ${mod_name_value}

This template was generated using c-leri's [Quilt Template Mod Generator](https://c-leri.github.io/quilt-template-mod-generator/)
`;
}

/**
 * @returns the content of the libs.versions.toml file
 */
export function generate_libs_versions_toml(): string {
	const qfapi_version = use_qsl_qfapi_value
		? `\n\nquilted_fabric_api = "${qsl_qfapi_version_value}"`
		: '';

	const qfapi_lib = use_qsl_qfapi_value
		? `\n\nquilted_fabric_api = { module = "org.quiltmc.quilted-fabric-api:quilted-fabric-api", version.ref = "quilted_fabric_api" }
quilted_fabric_api_deprecated = { module = "org.quiltmc.quilted-fabric-api:quilted-fabric-api-deprecated", version.ref = "quilted_fabric_api" }`
		: '';

	const bundle_example = use_qsl_qfapi_value
		? 'quilted_fabric_api = ["quilted_fabric_api", "quilted_fabric_api_deprecated"]'
		: '# example = ["example-a", "example-b", "example-c"]';

	return `[versions]
# The latest versions are available at https://lambdaurora.dev/tools/import_quilt.html
minecraft = "${minecraft_version_value}"
quilt_mappings = "${quilt_mappings_version_value}"
quilt_loader = "${quilt_loader_version_value}"${qfapi_version}

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
	const initializer_import = use_qsl_qfapi_value
		? `import org.quiltmc.loader.api.ModContainer;
import org.quiltmc.qsl.base.api.entrypoint.ModInitializer;\n`
		: '';

	const initializer_implement = use_qsl_qfapi_value ? 'implements ModInitializer ' : '';

	const initializer_override = use_qsl_qfapi_value
		? `\n\n\t@Override
\tpublic void onInitialize(ModContainer mod) {
\t\tLOGGER.info("Hello Quilt world from {}!", mod.metadata().name());
\t}`
		: '';

	return `package ${group_id_value}.${mod_id_value};

${initializer_import}import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ${mod_java_class_value} ${initializer_implement}{
\t// This logger is used to write text to the console and the log file.
\t// It is considered best practice to use your mod name as the logger's name.
\t// That way, it's clear which mod wrote info, warnings, and errors.
\tpublic static final Logger LOGGER = LoggerFactory.getLogger("${mod_name_value}");${initializer_override}
}
`;
}

/**
 * @returns the content of the client java class
 */
export function generate_java_client(): string {
	const initializer_import = use_qsl_qfapi_value
		? `\nimport org.quiltmc.loader.api.ModContainer;
import org.quiltmc.qsl.base.api.entrypoint.client.ClientModInitializer;${
				mod_environment_value !== 'client' ? '\n' : ''
		  }`
		: '';

	const logger_import =
		mod_environment_value === 'client'
			? '\nimport org.slf4j.Logger;\nimport org.slf4j.LoggerFactory;\n'
			: '';

	const initializer_implement = use_qsl_qfapi_value ? 'implements ClientModInitializer ' : '';

	const logger_declaration =
		mod_environment_value === 'client'
			? `\t// This logger is used to write text to the console and the log file.
\t// It is considered best practice to use your mod name as the logger's name.
\t// That way, it's clear which mod wrote info, warnings, and errors.
\tpublic static final Logger LOGGER = LoggerFactory.getLogger("${mod_name_value}");\n${
					use_qsl_qfapi_value ? '\n' : ''
			  }`
			: '';

	const initializer_override = use_qsl_qfapi_value
		? `\t@Override
\tpublic void onInitializeClient(ModContainer mod) {${
				mod_environment_value === 'client'
					? '\n\t\tLOGGER.info("Hello Quilt world from {}!", mod.metadata().name());'
					: ''
		  }
\t}\n`
		: '';

	return `package ${group_id_value}.${mod_id_value}.client;
${initializer_import}${logger_import}
public class ${mod_java_class_value}Client ${initializer_implement}{
${logger_declaration}${initializer_override}}
`;
}

/**
 * @returns the content of the mixin example java class
 */
export function generate_java_mixin(): string {
	return `package ${group_id_value}.${mod_id_value}.mixin;

import ${group_id_value}.${mod_id_value}.${
		mod_environment_value === 'client'
			? 'client.' + mod_java_class_value + 'Client'
			: mod_java_class_value
	};
${
	mod_environment_value === 'server'
		? 'import net.minecraft.server.MinecraftServer;'
		: 'import net.minecraft.client.gui.screen.TitleScreen;'
}
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

@Mixin(${mod_environment_value === 'server' ? 'MinecraftServer' : 'TitleScreen'}.class)
public class ${mod_environment_value === 'server' ? 'MinecraftServer' : 'TitleScreen'}Mixin {
\t@Inject(method = "${mod_environment_value === 'server' ? 'loadWorld' : 'init'}", at = @At("TAIL"))
\tpublic void onInit(CallbackInfo ci) {
\t\t${
		mod_environment_value === 'client' ? mod_java_class_value + 'Client' : mod_java_class_value
	}.LOGGER.info("This line is printed by a mixin of ${mod_name_value}!");
\t}
}
`;
}

/**
 * @returns the content of the quilt.mod.json file
 */
export function generate_quilt_mod_json(): string {
	let entrypoints = '';
	if (use_qsl_qfapi_value) {
		entrypoints = '\n\t\t"entrypoints": {\n';
		switch (mod_environment_value) {
			case 'client':
				entrypoints += `\t\t\t"client_init": "${group_id_value}.${mod_id_value}.client.${mod_java_class_value}Client"\n`;
				break;
			case 'both':
				entrypoints += `\t\t\t"init": "${group_id_value}.${mod_id_value}.${mod_java_class_value}",
\t\t\t"client_init": "${group_id_value}.${mod_id_value}.client.${mod_java_class_value}Client"\n`;
				break;
			case 'server':
				entrypoints += `\t\t\t"init": "${group_id_value}.${mod_id_value}.${mod_java_class_value}"\n`;
				break;
		}
		entrypoints += '\t\t},';
	}

	let contact = '';
	if (homepage_url_value || issues_url_value || source_url_value) {
		contact = '\n\t\t\t"contact": {';

		if (homepage_url_value) {
			contact += `\n\t\t\t\t"homepage": "${homepage_url_value}"${
				issues_url_value || source_url_value ? ',' : ''
			}`;
		}

		if (issues_url_value) {
			contact += `\n\t\t\t\t"issues": "${issues_url_value}"${source_url_value ? ',' : ''}`;
		}

		if (source_url_value) {
			contact += `\n\t\t\t\t"sources": "${source_url_value}"`;
		}

		contact += '\n\t\t\t},';
	}

	const description = description_value ? `\n\t\t\t"description": "${description_value}",` : '';

	const contributors = author_value
		? `\n\t\t\t"contributors": {
\t\t\t\t"${author_value}": "Owner"
\t\t\t},`
		: '';

	const license = license_value ? `\n\t\t\t"license": "${license_value}",` : '';

	const qfapi = use_qsl_qfapi_value
		? `\n\t\t\t{
\t\t\t\t"id": "quilted_fabric_api",
\t\t\t\t"versions": ">=${qsl_qfapi_version_value.replace(/-.+/g, '-')}"
\t\t\t},`
		: '';

	const mixin = use_mixins_value ? `\n\t"mixin": "${mod_id_value}.mixins.json",` : '';

	return `{
\t"schema_version": 1,
\t"quilt_loader": {
\t\t"group": "${group_id_value}",
\t\t"id": "${mod_id_value}",
\t\t"version": "\${version}",
\t\t"metadata": {
\t\t\t"name": "${mod_name_value}",${description}${contact}${contributors}${license}
\t\t\t"icon": "assets/${mod_id_value}/icon.png"
\t\t},
\t\t"intermediate_mappings": "net.fabricmc:intermediary",${entrypoints}
\t\t"depends": [
\t\t\t{
\t\t\t\t"id": "quilt_loader",
\t\t\t\t"versions": ">=${quilt_loader_version_value.replace(/-.+/g, '-')}"
\t\t\t},${qfapi}
\t\t\t{
\t\t\t\t"id": "minecraft",
\t\t\t\t"versions": "~${minecraft_version_value}"
\t\t\t}
\t\t]
\t},${mixin}
\t"minecraft": {
\t\t"mod_environment_valueironment": "${
		mod_environment_value === 'both'
			? '*'
			: mod_environment_value === 'server'
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
    "package": "${group_id_value}.${mod_id_value}.mixin",
    "compatibilityLevel": "JAVA_17",
    "mixins": [],
    "client": [${mod_environment_value !== 'server' ? '\n    "TitleScreenMixin"\n  ' : ''}],
    "server": [${mod_environment_value === 'server' ? '\n    "MinecraftServerMixin"\n  ' : ''}],
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
  
  Copyright (c) ${new Date().getFullYear()} ${author_value ? author_value : '<copyright holders>'}
  
  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice (including the next paragraph) shall be included in all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  `;
}
