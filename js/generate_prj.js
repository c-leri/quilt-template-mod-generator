// Desc: generate project zip file and download it
import {gen_prj_zip} from "./core/gen_prj_zip.js";

export async function gen_and_download_zip() {
    // TODO: test if all required fields are filled
    // project config
    var artifact_id = document.getElementById("artifactID").value;
    var group_id = document.getElementById("groupID").value;
    var gradle_ver = document.getElementById("gradleVersion").value;
    var use_q_decompiler = document.getElementById("useQuiltFlower").checked;

    // mod config
    var mod_name = document.getElementById("modName").value;
    var mod_ver = document.getElementById("modVersion").value;
    var env = document.getElementById("environment").value;

    // dependency config
    var mc_ver = document.getElementById("mcVersion").value;
    var loader_ver = document.getElementById("loaderVersion").value;
    var q_mapping_ver = document.getElementById("quiltMapping").value.toString().split("+build.")[1]
    var qsl_ver = document.getElementById("qslVersion").value.toString().replace("+" + mc_ver, "");
    var qfapi_ver = document.getElementById("qfapiVersion").value.toString().replace("-" + mc_ver, "");
    var use_qsl = document.getElementById("useQSL").checked;
    var use_mixins = document.getElementById("useMixins").checked;

    // optional config
    var desc = document.getElementById("description").value.toString().replaceAll("\n", "\\n");
    var author = document.getElementById("author").value;
    var homepage = document.getElementById("homepage").value;
    var source_repo = document.getElementById("sourceRepo").value;
    var issues = document.getElementById("issues").value;

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

    let zip = gen_prj_zip(
        artifact_id, group_id, gradle_ver, use_q_decompiler,
        mod_name, mod_ver, env,
        mc_ver, loader_ver, q_mapping_ver, qsl_ver, qfapi_ver, use_qsl, use_mixins,
        desc, author, homepage, source_repo, issues);

    zip.generateAsync({type: "blob"}).then(
        function (ctx_) {
            let link = document.createElement("a");
            link.href = URL.createObjectURL(ctx_);
            link.download = mod_name.replaceAll(" ", "-") + ".zip";
            link.click();
        }
    );
}