import "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jszip-utils/0.1.0/jszip-utils.min.js";

import {
    generate_gradle_properties,
    generate_libs_versions_toml,
    generate_gradle_wrapper_properties,
    generate_java_main,
    generate_java_client,
    generate_java_mixin,
    generate_quilt_mod_json,
    generate_mixins_json,
    generate_build_gradle
} from "./gen_files_content.js";

/**
 * @param {string} fileName the name of the file to get
 * @returns a promise of the requested file data
 */
async function get_static_file_data(fileName) {
    return (await fetch("res/static/" + fileName)).arrayBuffer();
}

/**
 * @param {JSZip} folder the folder to add the file to
 * @param {string} fileName the name of the file to add
 */
function add_static_file_to_folder(folder, fileName) {
    folder.file(fileName, get_static_file_data(fileName), { binary: true });
}

/**
 * @param {string} archive_name 
 * @param {string} group_id 
 * @param {string} gradle_version 
 * @param {string} mod_name 
 * @param {string} mod_version 
 * @param {"client"|"both"|"server"} env 
 * @param {string} minecraft_version 
 * @param {string} quilt_loader_version 
 * @param {string} quilt_mappings_version 
 * @param {string} quilted_fabric_api_version 
 * @param {boolean} use_mixins 
 * @param {string} description 
 * @param {string} author 
 * @param {string} homepage 
 * @param {string} sources 
 * @param {string} issues 
 * @returns {JSZip} the generated template
 */
export function gen_prj_zip(
    archive_name,
    group_id,
    gradle_version,
    mod_name,
    mod_version,
    env,
    minecraft_version,
    quilt_loader_version,
    quilt_mappings_version,
    quilted_fabric_api_version,
    use_mixins,
    description,
    author,
    homepage,
    sources,
    issues
) {
    const zip = new JSZip();

    add_static_file_to_folder(zip, ".editorconfig");
    add_static_file_to_folder(zip, ".gitattributes")
    add_static_file_to_folder(zip, ".gitignore");
    add_static_file_to_folder(zip, "gradlew");
    add_static_file_to_folder(zip, "gradlew.bat");
    add_static_file_to_folder(zip, "settings.gradle");

    zip.file("build.gradle", generate_build_gradle(archive_name));
    zip.file("gradle.properties", generate_gradle_properties(mod_version, group_id, archive_name));

    const gradle_folder = zip.folder("gradle");
    gradle_folder.file(
        "libs.versions.toml",
        generate_libs_versions_toml(minecraft_version, quilt_mappings_version, quilt_loader_version, quilted_fabric_api_version)
    );

    const gradle_wrapper_folder = gradle_folder.folder("wrapper");
    add_static_file_to_folder(gradle_wrapper_folder, "gradle-wrapper.jar");
    gradle_wrapper_folder.file("gradle-wrapper.properties", generate_gradle_wrapper_properties(gradle_version));

    const main_folder = zip.folder("src/main");

    const mod_package = main_folder.folder(`java/${group_id.replaceAll(".", "/")}/${archive_name}`);

    if (env === "server" || env === "both") {
        mod_package.file(`${mod_name.replaceAll(" ", "")}.java`, generate_java_main(archive_name, group_id, mod_name));
    }

    if (env === "client" || env === "both") {
        const client_package = mod_package.folder("client");
        client_package.file(`${mod_name.replaceAll(" ", "")}Client.java`, generate_java_client(archive_name, group_id, mod_name, env));
    }

    if (use_mixins) {
        const mixin_package = mod_package.folder("mixin");
        mixin_package.file("TitleScreenMixin.java", generate_java_mixin(archive_name, group_id, mod_name, env))
    }

    const resources_folder = main_folder.folder("resources");
    resources_folder.file(
        "quilt.mod.json",
        generate_quilt_mod_json(
            group_id,
            archive_name,
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
        )
    );

    if (use_mixins) {
        resources_folder.file(`${archive_name}.mixins.json`, generate_mixins_json(archive_name, group_id));
    }

    const mod_assets_folder = resources_folder.folder(`assets/${archive_name}`);
    add_static_file_to_folder(mod_assets_folder, "icon.png");

    return zip;
}