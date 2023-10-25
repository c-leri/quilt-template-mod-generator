// Desc: generate project zip file and download it
import {gen_prj_zip} from "./core/gen_prj_zip.js";

export async function gen_and_download_zip() {
    // TODO: test if all required fields are filled
    // project config
    const artifact_id = document.getElementById("artifactID").value;
    const group_id = document.getElementById("groupID").value;
    const gradle_ver = document.getElementById("gradleVersion").value;

    // mod config
    const mod_name = document.getElementById("modName").value;
    const mod_ver = document.getElementById("modVersion").value;
    const env = document.getElementById("environment").value;

    // dependency config
    const mc_ver = document.getElementById("mcVersion").value;
    const loader_ver = document.getElementById("loaderVersion").value;
    const q_mapping_ver = document.getElementById("quiltMapping").value.toString();
    const use_qfapi = document.getElementById("useQfapi").checked;
    const qfapi_ver = document.getElementById("qfapiVersion").value.toString();
    const use_mixins = document.getElementById("useMixins").checked;

    // optional config
    const license = document.getElementById("license").value;
    const desc = document.getElementById("description").value.toString().replaceAll("\n", "\\n");
    const author = document.getElementById("author").value;
    const homepage = document.getElementById("homepage").value;
    const source_repo = document.getElementById("sourceRepo").value;
    const issues = document.getElementById("issues").value;

    if (artifact_id === "") {
        window.alert("Artifact ID cannot be empty!");
        return;
    } else if (group_id === "") {
        window.alert("Group ID cannot be empty!");
        return;
    } else if (mod_name === "") {
        window.alert("Mod name cannot be empty!");
        return;
    } else if (mod_ver === "") {
        window.alert("Mod version cannot be empty!");
        return;
    }

    if (use_qfapi && qfapi_ver === "") {
        window.alert("Quilted Fabric API for Minecraft version " + mc_ver + " cannot be found!\n" +
        "Your project will be generated without QFAPI.");
    }

    let zip = gen_prj_zip(
        artifact_id, group_id, gradle_ver,
        mod_name, mod_ver, env,
        mc_ver, loader_ver, q_mapping_ver, use_qfapi, qfapi_ver, use_mixins,
        license, desc, author, homepage, source_repo, issues
    );

    zip.generateAsync({type: "blob"}).then(
        function (ctx_) {
            let link = document.createElement("a");
            link.href = URL.createObjectURL(ctx_);
            link.download = mod_name.replaceAll(" ", "-") + ".zip";
            link.click();
        }
    );
}