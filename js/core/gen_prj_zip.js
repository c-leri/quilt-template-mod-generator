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
    generate_build_gradle,
    generate_mit_license,
    generate_readme_md
} from "./gen_files_content.js";

/**
 * @param {JSZip} folder the folder to add the file to
 * @param {string} fileName the name of the file to add
 * @param {string} fileType the file's MIME type
 */
async function add_static_file_to_folder(folder, fileName, fileType) {
    folder.file(
        fileName,
        (await fetch("res/static/" + fileName.replaceAll(".", "-"),{
            method: "GET",
            headers: {
                "Accept": fileType
            }
        }).catch((err) => console.error(err))).arrayBuffer(),
        { binary: true }
    );
}

/**
 * @param {JSZip} folder the folder to add the file to
 * @param {string} license the name of the license to add
 * @param {string} author the name of the mod's author
 */
async function add_license_file_to_folder(folder, license, author) {
    let license_content = "";

    if (license === "MIT") {
        license_content = generate_mit_license(author);
    } else if (license) {
        license_content = (await fetch("res/static/licenses/" + fileName,{
            method: "GET",
            headers: {
                "Accept": "text/plain"
            } 
        })).text()
    }

    if (license_content) {
        folder.file("LICENSE", license_content);
    }
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
 * @param {boolean} use_qfapi 
 * @param {string} quilted_fabric_api_version 
 * @param {boolean} use_mixins 
 * @param {string} license 
 * @param {string} description 
 * @param {string} author 
 * @param {string} homepage 
 * @param {string} sources 
 * @param {string} issues 
 * @returns {JSZip} the generated template
 */
export async function gen_prj_zip(
    archive_name,
    group_id,
    gradle_version,
    mod_name,
    mod_version,
    env,
    minecraft_version,
    quilt_loader_version,
    quilt_mappings_version,
    use_qfapi,
    quilted_fabric_api_version,
    use_mixins,
    license,
    description,
    author,
    homepage,
    sources,
    issues
) {
    const zip = new JSZip();

    await Promise.all([
        add_static_file_to_folder(zip, ".editorconfig", "text/plain"),
        add_static_file_to_folder(zip, ".gitattributes", "text/plain"),
        add_static_file_to_folder(zip, ".gitignore", "text/plain"),
        add_static_file_to_folder(zip, "gradlew", "text/plain"),
        add_static_file_to_folder(zip, "gradlew.bat", "text/plain"),
        add_static_file_to_folder(zip, "settings.gradle", "text/plain"),
        add_license_file_to_folder(zip, license, author)
    ]);

    zip.file("build.gradle", generate_build_gradle(archive_name, use_qfapi));
    zip.file("gradle.properties", generate_gradle_properties(mod_version, group_id, archive_name));
    zip.file("README.md", generate_readme_md(mod_name));

    const gradle_folder = zip.folder("gradle");
    gradle_folder.file(
        "libs.versions.toml",
        generate_libs_versions_toml(minecraft_version, quilt_mappings_version, quilt_loader_version, use_qfapi, quilted_fabric_api_version)
    );

    const gradle_wrapper_folder = gradle_folder.folder("wrapper");
    await add_static_file_to_folder(gradle_wrapper_folder, "gradle-wrapper.jar", "application/java-archive");
    gradle_wrapper_folder.file("gradle-wrapper.properties", generate_gradle_wrapper_properties(gradle_version));

    const main_folder = zip.folder("src/main");

    const mod_package = main_folder.folder(`java/${group_id.replaceAll(".", "/")}/${archive_name}`);

    if (env === "server" || env === "both") {
        mod_package.file(`${mod_name.replaceAll(" ", "")}.java`, generate_java_main(archive_name, group_id, mod_name, use_qfapi));
    }

    if (env === "client" || env === "both") {
        const client_package = mod_package.folder("client");
        client_package.file(`${mod_name.replaceAll(" ", "")}Client.java`, generate_java_client(archive_name, group_id, mod_name, use_qfapi, env));
    }

    if (use_mixins) {
        const mixin_package = mod_package.folder("mixin");
        mixin_package.file(`${env === "server" ? "MinecraftServerMixin" : "TitleScreenMixin"}.java`, generate_java_mixin(archive_name, group_id, mod_name, env))
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
            use_qfapi,
            quilted_fabric_api_version,
            quilt_loader_version,
            minecraft_version,
            use_mixins,
            license
        )
    );

    if (use_mixins) {
        resources_folder.file(`${archive_name}.mixins.json`, generate_mixins_json(archive_name, group_id, env));
    }

    const mod_assets_folder = resources_folder.folder(`assets/${archive_name}`);
    await add_static_file_to_folder(mod_assets_folder, "icon.png", "image.png");

    return zip;
}