/**
 * @param {string} mod_id 
 * @returns {string} the content of the build.gralde file
 */
export function generate_build_gradle(mod_id) {
    return `plugins {
    id 'maven-publish'
    alias libs.plugins.quilt.loom
}

base {
    archivesName = project.archives_base_name
}

version = "$project.version+\${libs.versions.minecraft.get()}"
group = project.maven_group

repositories {
    // Add repositories to retrieve artifacts from in here.
    // You should only use this when depending on other mods because
    // Loom adds the essential maven repositories to download Minecraft and libraries from automatically.
    // See https://docs.gradle.org/current/userguide/declaring_repositories.html
    // for more information about repositories.
}

loom {
    // Loom and Loader both use this block in order to gather more information about your mod.
    mods {
        // This should match your mod id.
        "${mod_id}" {
            // Tell Loom about each source set used by your mod here. This ensures that your mod's classes are properly transformed by Loader.
            sourceSet("main")
            // If you shade (directly include classes, not JiJ) a dependency into your mod, include it here using one of these methods:
            // dependency("com.example.shadowedmod:1.2.3")
            // configuration("exampleShadedConfigurationName")
        }
    }
}

// All the dependencies are declared at gradle/libs.version.toml and referenced with "libs.<id>"
// See https://docs.gradle.org/current/userguide/platforms.html for information on how version catalogs work.
dependencies {
    minecraft libs.minecraft
    mappings variantOf(libs.quilt.mappings) { classifier 'intermediary-v2' }
    // Replace the above line with the block below if you want to use Mojang mappings as your primary mappings, falling back on QM for parameters and Javadocs
    /*
    mappings loom.layered {
        mappings "org.quiltmc:quilt-mappings:\${libs.versions.quilt.mappings.get()}:intermediary-v2"
        officialMojangMappings()
    }
    */
    modImplementation libs.quilt.loader

    // QSL is not a complete API; You will need Quilted Fabric API to fill in the gaps.
    // Quilted Fabric API will automatically pull in the correct QSL version.
    modImplementation libs.quilted.fabric.api
    // modImplementation libs.bundles.quilted.fabric.api // If you wish to use Fabric API's deprecated modules, you can replace the above line with this one
}

processResources {
    inputs.property 'version', version

    filesMatching('quilt.mod.json') {
        expand 'version': version
    }
}

tasks.withType(JavaCompile).configureEach {
    it.options.encoding = 'UTF-8'
    // Minecraft 1.18 (1.18-pre2) upwards uses Java 17.
    it.options.release = 17
}

java {
    // Still required by IDEs such as Eclipse and Visual Studio Code
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17

    // Loom will automatically attach sourcesJar to a RemapSourcesJar task and to the "build" task if it is present.
    // If you remove this line, sources will not be generated.
    withSourcesJar()

    // If this mod is going to be a library, then it should also generate Javadocs in order to aid with development.
    // Uncomment this line to generate them.
    // withJavadocJar()
}

// If you plan to use a different file for the license, don't forget to change the file name here!
jar {
    from('LICENSE') {
        rename { "\${it}_\${base.archivesName.get()}" }
    }
}

// Configure the maven publication
publishing {
    publications {
        mavenJava(MavenPublication) {
            from components.java
        }
    }

    // See https://docs.gradle.org/current/userguide/publishing_maven.html for information on how to set up publishing.
    repositories {
        // Add repositories to publish to here.
        // Notice: This block does NOT have the same function as the block in the top level.
        // The repositories here will be used for publishing your artifact, not for
        // retrieving dependencies.
    }
}
`;
}

/**
 * @param {string} mod_version 
 * @param {string} group_id 
 * @param {string} archive_name 
 * @returns {string} the content of the gradle.properties file
 */
export function generate_gradle_properties(
    mod_version,
    group_id,
    archive_name
) {
    return `# Gradle Properties
org.gradle.jvmargs = -Xmx1G
org.gradle.parallel = true

# Mod Properties
version = ${mod_version}
maven_group = ${group_id}
archives_base_name = ${archive_name}

# Dependencies are managed at gradle/libs.versions.toml
`;
}

/**
 * @param {string} minecraft_version 
 * @param {string} quilt_mappings_version 
 * @param {string} quilt_loader_version 
 * @param {string} quilted_fabric_api_version 
 * @returns {string} the content of the libs.versions.toml file
 */
export function generate_libs_versions_toml(
    minecraft_version,
    quilt_mappings_version,
    quilt_loader_version,
    quilted_fabric_api_version
) {
    return `[versions]
# The latest versions are available at https://lambdaurora.dev/tools/import_quilt.html
minecraft = "${minecraft_version}"
quilt_mappings = "${quilt_mappings_version}"
quilt_loader = "${quilt_loader_version}"

quilted_fabric_api = "${quilted_fabric_api_version}"

[libraries]
minecraft = { module = "com.mojang:minecraft", version.ref = "minecraft" }
quilt_mappings = { module = "org.quiltmc:quilt-mappings", version.ref = "quilt_mappings" }
quilt_loader = { module = "org.quiltmc:quilt-loader", version.ref = "quilt_loader" }

quilted_fabric_api = { module = "org.quiltmc.quilted-fabric-api:quilted-fabric-api", version.ref = "quilted_fabric_api" }
quilted_fabric_api_deprecated = { module = "org.quiltmc.quilted-fabric-api:quilted-fabric-api-deprecated", version.ref = "quilted_fabric_api" }

# If you have multiple similar dependencies, you can declare a dependency bundle and reference it on the build script with "libs.bundles.example".
[bundles]
quilted_fabric_api = ["quilted_fabric_api", "quilted_fabric_api_deprecated"]

[plugins]
quilt_loom = { id = "org.quiltmc.loom", version = "1.4.1" }
`;
}

/**
 * @param {string} gradle_version 
 * @returns {string} the content of the gradle-wrapper.properties file
 */
export function generate_gradle_wrapper_properties(gradle_version) {
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
 * @param {string} mod_id 
 * @param {string} group_id 
 * @param {string} mod_name 
 * @returns {string} the content of the main java class
 */
export function generate_java_main(
    mod_id,
    group_id,
    mod_name
) {
    return `package ${group_id}.${mod_id};

import org.quiltmc.loader.api.ModContainer;
import org.quiltmc.qsl.base.api.entrypoint.ModInitializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ${mod_name.replaceAll(" ", "")} implements ModInitializer {
    // This logger is used to write text to the console and the log file.
    // It is considered best practice to use your mod name as the logger's name.
    // That way, it's clear which mod wrote info, warnings, and errors.
    public static final Logger LOGGER = LoggerFactory.getLogger("${mod_name}");

    @Override
    public void onInitialize(ModContainer mod) {
        LOGGER.info("Hello Quilt world from {}!", mod.metadata().name());
    }
}
`;
}

/**
 * @param {string} mod_id 
 * @param {string} group_id 
 * @param {string} mod_name 
 * @param {"client"|"both"|"server"} env 
 * @returns {string} the content of the client java class
 */
export function generate_java_client(
    mod_id,
    group_id,
    mod_name,
    env
) {
    if (env === "client") {
        return `package ${group_id}.${mod_id}.client;

import org.quiltmc.loader.api.ModContainer;
import org.quiltmc.qsl.base.api.entrypoint.client.ClientModInitializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ${mod_name.replaceAll(" ", "")}Client implements ClientModInitializer {
    // This logger is used to write text to the console and the log file.
    // It is considered best practice to use your mod name as the logger's name.
    // That way, it's clear which mod wrote info, warnings, and errors.
    public static final Logger LOGGER = LoggerFactory.getLogger("${mod_name}");

    @Override
    public void onInitializeClient(ModContainer mod) {
        LOGGER.info("Hello Quilt world from {}!", mod.metadata().name());
    }
}
`
    } else return `package ${group_id}.${mod_id}.client;

import org.quiltmc.loader.api.ModContainer;
import org.quiltmc.qsl.base.api.entrypoint.client.ClientModInitializer;

public class ${mod_name.replaceAll(" ", "")}Client implements ClientModInitializer {
    @Override
    public void onInitializeClient(ModContainer mod) {}
}
`;
}

/**
 * @param {string} mod_id 
 * @param {string} group_id 
 * @param {string} mod_name 
 * @param {"client"|"both"|"server"} env 
 * @returns {string} the content of the mixin example java class
 */
export function generate_java_mixin(
    mod_id,
    group_id,
    mod_name,
    env
) {
    return `package ${group_id}.${mod_id}.mixin;

import ${group_id}.${mod_id}.${env === "client" ? "client." + mod_name.replaceAll(" ", "") + "Client" : mod_name.replaceAll(" ", "")};
import net.minecraft.client.gui.screen.TitleScreen;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

@Mixin(TitleScreen.class)
public class TitleScreenMixin {
    @Inject(method = "init", at = @At("TAIL"))
    public void onInit(CallbackInfo ci) {
        ${env === "client" ? mod_name.replaceAll(" ", "") + "Client" : mod_name.replaceAll(" ", "")}.LOGGER.info("This line is printed by an example mod mixin!");
    }
}
`;
}

/**
 * @param {string} group_id 
 * @param {string} mod_id 
 * @param {string} mod_name 
 * @param {string} description 
 * @param {string} author 
 * @param {string} homepage 
 * @param {string} issues 
 * @param {string} sources 
 * @param {"client"|"both"|"server"} env 
 * @param {string} quilted_fabric_api_version 
 * @param {string} quilt_loader_version 
 * @param {string} minecraft_version 
 * @param {boolean} use_mixins 
 * @returns {string} the content of the quilt.mod.json file
 */
export function generate_quilt_mod_json(
    group_id,
    mod_id,
    mod_name,
    description,
    author,
    homepage,
    issues,
    sources,
    env,
    quilted_fabric_api_version,
    quilt_loader_version,
    minecraft_version,
    use_mixins
) {
    let entrypoints = '"entrypoints": {\n';
    switch (env) {
        case "client":
            entrypoints += `            "client_init": "${group_id}.${mod_id}.client.${mod_name.replaceAll(" ", "")}Client"\n`;
            break
        case "both":
            entrypoints += `            "init": "${group_id}.${mod_id}.${mod_name.replaceAll(" ", "")}",
            "client_init": "${group_id}.${mod_id}.client.${mod_name.replaceAll(" ", "")}Client"\n`;
            break;
        case "server":
            entrypoints += `            "init": "${group_id}.${mod_id}.${mod_name.replaceAll(" ", "")}"\n`;
            break;
    }
    entrypoints += '        },';

    let mixin = "";
    if (use_mixins) {
        mixin = `,\n"mixin": "${mod_id}.mixins.json"`
    }

    return `{
    "schema_version": 1,
    "quilt_loader": {
        "group": "${group_id}",
        "id": "${mod_id}",
        "version": "\${version}",
        "metadata": {
            "name": "${mod_name}",
            "description": "${description}",
            "contributors": {
                "${author}": "Owner"
            },
            "contact": {
                "homepage": "${homepage}",
                "issues": "${issues}",
                "sources": "${sources}"
            },
            "icon": "assets/${mod_id}/icon.png"
        },
        "intermediate_mappings": "net.fabricmc:intermediary",
        ${entrypoints}
        "depends": [
            {
                "id": "quilt_loader",
                "versions": ">=${quilt_loader_version}"
            },
            {
                "id": "quilted_fabric_api",
                "versions": ">=${quilted_fabric_api_version}"
            },
            {
                "id": "minecraft",
                "versions": "~${minecraft_version}"
            }
        ]
    }${mixin}
}    
`;
}

/**
 * @param {string} mod_id 
 * @param {string} group_id 
 * @returns {string} the content of the <MOD_ID>.mixins.json file
 */
export function generate_mixins_json(mod_id, group_id) {
    return `{
    "required": true,
    "minVersion": "0.8",
    "package": "${group_id}.${mod_id}.mixin",
    "compatibilityLevel": "JAVA_17",
    "mixins": [],
    "client": [
        "TitleScreenMixin"
    ],
    "injectors": {
        "defaultRequire": 1
    }
}    
`;
}