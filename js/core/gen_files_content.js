export function generate_build_gradle(artifact_id, group_id, use_decompiler, use_qsl, qsl_snapshot= "", qfapi_snapshot = "") {
    let plugins = "plugins {\n" +
        "    id 'org.quiltmc.loom' version '1.+' // Required for the loader to work.\n";
    let dependencies = "dependencies {\n" +
        "    minecraft \"com.mojang:minecraft:${project.minecraft_version}\"\n" +
        "    mappings \"org.quiltmc:quilt-mappings:${project.minecraft_version}+build.${project.quilt_mappings}:intermediary-v2\"\n" +
        "    modImplementation \"org.quiltmc:quilt-loader:${project.loader_version}\"\n";
    let static_configs = "version = project.mod_version\n" +
        "group = project.maven_group\n\n";
    let process_resources = "processResources {\n" +
        "    inputs.property 'mod_version', project.mod_version\n" +
        "    inputs.property 'minecraft_version', project.minecraft_version\n" +
        "    filesMatching('quilt.mod.json') {\n" +
        "        expand 'mod_version': project.mod_version,\n" +
        "               'minecraft_version': project.minecraft_version\n" +
        "    }\n" +
        "}\n";
    if (use_decompiler) {
        plugins += "    id 'io.github.juuxel.loom-quiltflower' version '1.+'\n";
        plugins += "    id 'io.github.juuxel.loom-quiltflower-mini' version '1.+'\n";
    }
    plugins += "}\n\n";
    if (use_qsl) {
        dependencies += "    // QSL Library\n" +
            "    modImplementation \"org.quiltmc.qsl:core:${project.qsl_version}+${project.minecraft_version}" + qsl_snapshot + "\"\n" +
            "\n" +
            "    // QSL Module\n" +
            "    modImplementation \"org.quiltmc.qsl.core:resource_loader:${project.qsl_version}+${project.minecraft_version}" + qsl_snapshot + "\"\n" +
            "\n" +
            "    // Quilted Fabric API\n" +
            "    modImplementation \"org.quiltmc.quilted-fabric-api:quilted-fabric-api:${project.quilted_fabric_api_version}-${project.minecraft_version}" + qfapi_snapshot + "\"\n";
    }
    dependencies += "}\n\n";
    return plugins + static_configs + dependencies + process_resources;
}

export function generate_gradle_properties(mc_ver, qm_ver, loader_ver, mod_ver, group_id, arch_id, qsl_ver, qfapi_ver) {
    return "# Minecraft properties\n" +
    "    minecraft_version=" + mc_ver + "\n" +
    "    quilt_mappings=" + qm_ver + "\n" +
    "    loader_version=" + loader_ver + "\n" +
    "\n" +
    "# Mod properties\n" +
    "    mod_version=" + mod_ver + "\n" +
    "    maven_group=" + group_id + "\n" +
    "    archives_base_name=" + arch_id + "\n" +
    "\n" +
    "# Dependencies\n" +
    "    # QSL version number is shared between all the modules.\n" +
    "    qsl_version=" + qsl_ver + "\n" +
    "\n" +
    "    # Quilted Fabric API\n" +
    "    quilted_fabric_api_version = " + qfapi_ver;
}

export function generate_gradle_wrapper(gradle_ver) {
    return "distributionBase=GRADLE_USER_HOME\n" +
        "distributionPath=wrapper/dists\n" +
        "distributionUrl=https\\://services.gradle.org/distributions/gradle-" + gradle_ver + "-bin.zip\n" +
        "networkTimeout=10000\n" +
        "validateDistributionUrl=true\n" +
        "zipStoreBase=GRADLE_USER_HOME\n" +
        "zipStorePath=wrapper/dists"
}

export function generate_java_mod_client(mod_id, group_id, mod_name, use_qsl) {
    if (use_qsl) {
        return "package " + group_id + "." + mod_id + ".client;\n" +
            "\n" +
            "import org.quiltmc.loader.api.ModContainer;\n" +
            "import org.quiltmc.qsl.base.api.entrypoint.client.ClientModInitializer;\n" +
            "\n" +
            "public class " + mod_name.replaceAll(" ", "") + "Client implements ClientModInitializer {\n" +
            "    public void onInitializeClient(ModContainer mod) {}\n" +
            "}";
    } else {   // use fabric
        return "package " + group_id + "." + mod_id + ".client;\n" +
            "\n" +
            "import net.fabricmc.api.ModInitializer;\n" +
            "\n" +
            "public class " + mod_name.replaceAll(" ", "") + "Client implements ModInitializer {\n" +
            "    public void onInitialize() {}\n" +
            "}";
    }
}

export function generate_java_mod_main(mod_id, group_id, mod_name, use_qsl) {
    if (use_qsl) {
        return "package " + group_id + "." + mod_id + ";\n" +
            "\n" +
            "import org.quiltmc.loader.api.ModContainer;\n" +
            "import org.quiltmc.qsl.base.api.entrypoint.ModInitializer;\n" +
            "\n" +
            "public class " + mod_name.replaceAll(" ", "") + " implements ModInitializer {\n" +
            "    public void onInitialize(ModContainer mod) {}\n" +
            "}";
    } else {   // use fabric
        return "package " + group_id + "." + mod_id + ";\n" +
            "\n" +
            "import net.fabricmc.api.ClientModInitializer;\n" +
            "\n" +
            "public class " + mod_name.replaceAll(" ", "") + " implements ClientModInitializer {\n" +
            "    public void onInitializeClient() {}\n" +
            "}";
    }
}

export function generate_mixins_json(mod_id, group_id) {
    return "{\n" +
        "    \"required\": true,\n" +
        "    \"minVersion\": \"0.8\",\n" +
        "    \"package\": \"" + group_id + "." + mod_id + ".mixins\",\n" +
        "    \"client\": [\n" +
        "    ],\n" +
        "    \"injectors\": {\n" +
        "        \"defaultRequire\": 1\n" +
        "    }\n" +
        "}";
}

export function generate_settings_gradle() {
    return "repositories {\n" +
        "    maven {\n" +
        "        name = 'Quilt'\n" +
        "        url = 'https://maven.quiltmc.org/repository/release'\n" +
        "    }\n" +
        "    maven {\n" +
        "        name = 'Quilt Snapshots'\n" +
        "        url = 'https://maven.quiltmc.org/repository/snapshot'\n" +
        "    }" +
        "}";
}

export function generate_quilt_mod_json(mod_id, group_id, mod_name,
                                 author, desc, homepage, source_repo, issues,
                                 env, use_mixins, use_qsl) {
    let quilt_mod_json =  "{\n" +
        "    \"schema_version\": 1,\n" +
        "    \"quilt_loader\": {\n" +
        "        \"group\": \"" + group_id + "\",\n" +
        "        \"id\": \"" + mod_id + "\",\n" +
        "        \"version\": \"${mod_version}\",\n" +
        "        \"metadata\": {\n" +
        "            \"name\": \"" + mod_name + "\",\n";
    if (desc !== "") {
        quilt_mod_json += "            \"description\": \"" + desc + "\",\n";
    }
    if (author !== "") {
        quilt_mod_json += "            \"contributors\": {\n" +
            "                \"" + author + "\": \"Owner\"\n" +
            "            },\n";
    }
    quilt_mod_json += "            \"contact\": {\n";
    if (homepage !== "") {
        quilt_mod_json += "                \"homepage\": \"" + homepage + "\"" + (source_repo !== "" ? ",\n" : "\n");
    }
    if (source_repo !== "") {
        quilt_mod_json += "                \"sources\": \"" + source_repo + "\"" + (issues !== "" ? ",\n" : "\n");
    }
    if (issues !== "") {
        quilt_mod_json += "                \"issues\": \"" + issues + "\",\n";
    }
    quilt_mod_json += "            },\n" +
        "            \"icon\": \"assets/" + mod_id + "/icon.png\"\n" +
        "        },\n" +
        "        \"intermediate_mappings\": \"net.fabricmc:intermediary\",\n" +
        "        \"entrypoints\": {\n";
    if (env === "client" || env === "both") {
        quilt_mod_json +=
        "            \"client_init\": [\n" +
        "                \"" + group_id + "." + mod_id + ".client." + mod_name.replaceAll(" ", "") + "Client\"\n" +
        "            ]" + (env === "both" ? ",\n" : "\n");
    }
    if (env === "server" || env === "both") {
        quilt_mod_json +=
        "            \"init\": [\n" +
        "                \"" + group_id + "." + mod_id + "." + mod_name.replaceAll(" ", "") + "\"\n" +
        "            ]\n";
    }
    quilt_mod_json +=
        "        },\n" +
        "        \"depends\": [\n" +
        "            {\n" +
        "                \"id\": \"minecraft\",\n" +
        "                \"versions\": {\n" +
        "                    \"all\": [\"${minecraft_version}\"]\n" +
        "                }\n" +
        "            },\n" +
        "            {\n" +
        "                \"id\": \"quilt_loader\",\n" +
        "                \"versions\": \"*\"\n" +
        "            }" +
        (use_qsl ? ",\n" +
        "            {\n" +
        "                \"id\": \"quilted_fabric_api\",\n" +
        "                \"versions\": \"*\"\n" +
        "            }\n" : "\n") +
        "        ]\n" +
        "    }";
    if (use_mixins) {
        quilt_mod_json += ",\n" +
            "    \"mixins\": [\n" +
            "        \"" + mod_id + ".mixins.json\"\n" +
            "    ]\n";
    }
    quilt_mod_json += "}";
    return quilt_mod_json;
}