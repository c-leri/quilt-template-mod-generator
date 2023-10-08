import "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jszip-utils/0.1.0/jszip-utils.min.js";
import "/js/core/gen_files_content.js";
import {
    generate_build_gradle,
    generate_gradle_properties,
    generate_gradle_wrapper,
    generate_java_mod_client,
    generate_java_mod_main,
    generate_mixins_json,
    generate_quilt_mod_json, generate_settings_gradle
} from "./gen_files_content.js";

export function gen_prj_zip(
    artifact_id, group_id, gradle_ver, use_q_decompiler,
    mod_name, mod_version, env,
    mc_ver, q_loader_ver, q_mapping_ver, qsl_ver, qfapi_ver, use_qsl, use_mixins,
    desc, author, homepage, source_repo, issues) {
    const zip = new JSZip();
    if (qsl_ver === "" || qfapi_ver === "") {
        window.alert("QSL version and Quilted Fabric API version cannot be found!");
        use_qsl = false;
    }
    zip.file("gradle/wrapper/gradle-wrapper.properties",
        generate_gradle_wrapper(gradle_ver));
    zip.file("gradle.properties",
        generate_gradle_properties(
            mc_ver,
            q_mapping_ver,
            q_loader_ver,
            mod_version,
            group_id,
            artifact_id,
            qsl_ver,
            qfapi_ver));
    zip.file("settings.gradle", generate_settings_gradle());
    zip.file("build.gradle",
        generate_build_gradle(
            artifact_id,
            group_id,
            use_q_decompiler,
            use_qsl));
    zip.file("src/main/resources/quilt.mod.json",
        generate_quilt_mod_json(
            artifact_id,
            group_id,
            mod_name,
            author,
            desc,
            homepage,
            source_repo,
            issues,
            env,
            use_mixins,
            use_qsl));
    if (use_mixins) {
        zip.file("src/main/resources/mixins.json", generate_mixins_json(artifact_id, group_id));
    }
    if (env === "server" || env === "both") {
        zip.file("src/main/java/" + group_id.replaceAll(".", "/") + "/" + artifact_id + "/" + mod_name.replaceAll(" ", "") + ".java",
            generate_java_mod_main(
                artifact_id,
                group_id,
                mod_name,
                use_qsl));
    }
    if (env === "client" || env === "both") {
        zip.file("src/main/java/" + group_id.replaceAll(".", "/") + "/" + artifact_id + "/client/" + mod_name.replaceAll(" ", "") + "Client.java",
            generate_java_mod_client(
                artifact_id,
                group_id,
                mod_name,
                use_qsl));
    }
    // read the icon file as binary string from the server res/favicon.ico
    let icon_data = fetch("res/static/icon.png").then(function (response) {
        return response.arrayBuffer();
    });
    zip.file("src/main/resources/assets/" + artifact_id + "/icon.png", icon_data, {binary: true});

    return zip;
}