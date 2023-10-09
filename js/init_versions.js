import {
        gradle_versions,
        minecraft_versions,
        qfapi_versions,
        qsl_versions,
        quilt_loader_versions,
        quilt_mapping_versions,
    } from "./get_version/get_vers.js";

export async function init_versions() {
    // set up version selectors
    let gradle_ver_select = document.getElementById("gradleVersion");
    let mc_ver_select = document.getElementById("mcVersion");
    let loader_ver_select = document.getElementById("loaderVersion");
    let q_mapping_ver_select = document.getElementById("quiltMapping");
    let qsl_ver_select = document.getElementById("qslVersion");
    let qfapi_ver_select = document.getElementById("qfapiVersion");

    // get mc stable versions checkbox
    let mc_stable_checkbox = document.getElementById("mcStable");
    const mc_stable = mc_stable_checkbox.checked;

    // get versions
    const gradle_version_list = (await gradle_versions()).map((ver) => ver.toString());
    const mc_version_list = (await minecraft_versions(mc_stable)).map((ver) => ver.toString());
    const current_mc_ver = mc_version_list[0];
    const loader_version_list = (await quilt_loader_versions()).map((ver) => ver.toString());
    const q_mapping_version_list = (await quilt_mapping_versions(current_mc_ver)).map((ver) => ver.toString());
    const qsl_version_list = (await qsl_versions(current_mc_ver)).map((ver) => ver.toString());
    const qfapi_version_list = (await qfapi_versions(current_mc_ver)).map((ver) => ver.toString());

    gradle_version_list.forEach((ver) => {
        let option = document.createElement("option");
        option.value = ver;
        option.innerText = ver;
        gradle_ver_select.append(option);
    });
    mc_version_list.forEach((ver) => {
        let option = document.createElement("option");
        option.value = ver;
        option.innerText = ver;
        mc_ver_select.append(option);
    });
    loader_version_list.forEach((ver) => {
        let option = document.createElement("option");
        option.value = ver;
        option.innerText = ver;
        loader_ver_select.append(option);
    });
    q_mapping_version_list.forEach((ver) => {
        let option = document.createElement("option");
        option.value = ver;
        option.innerText = ver;
        q_mapping_ver_select.append(option);
    });
    qsl_version_list.forEach((ver) => {
        let option = document.createElement("option");
        option.value = ver;
        option.innerText = ver;
        qsl_ver_select.append(option);
    });
    qfapi_version_list.forEach((ver) => {
        let option = document.createElement("option");
        option.value = ver;
        option.innerText = ver;
        qfapi_ver_select.append(option);
    });
}

export async function reload_mc_versions() {
    const mc_stable = document.getElementById("mcStable").checked;
    let mc_ver_select = document.getElementById("mcVersion");
    mc_ver_select.innerHTML = "";
    const mc_version_list = (await minecraft_versions(mc_stable)).map((ver) => ver.toString());
    mc_version_list.forEach((ver) => {
        let option = document.createElement("option");
        option.value = ver;
        option.innerText = ver;
        mc_ver_select.append(option);
    });
    await reload_q_dpendencies_list();
}

export async function reload_q_dpendencies_list() {
    const mc_ver = document.getElementById("mcVersion").value;
    let q_mapping_ver_select = document.getElementById("quiltMapping");
    let qsl_ver_select = document.getElementById("qslVersion");
    let qfapi_ver_select = document.getElementById("qfapiVersion");
    q_mapping_ver_select.innerHTML = "";
    qsl_ver_select.innerHTML = "";
    qfapi_ver_select.innerHTML = "";
    const q_mapping_version_list = (await quilt_mapping_versions(mc_ver)).map((ver) => ver.toString());
    const qsl_version_list = (await qsl_versions(mc_ver)).map((ver) => ver.toString());
    const qfapi_version_list = (await qfapi_versions(mc_ver)).map((ver) => ver.toString());
    q_mapping_version_list.forEach((ver) => {
        let option = document.createElement("option");
        option.value = ver;
        option.innerText = ver;
        q_mapping_ver_select.append(option);
    });
    qsl_version_list.forEach((ver) => {
        let option = document.createElement("option");
        option.value = ver;
        option.innerText = ver;
        qsl_ver_select.append(option);
    });
    qfapi_version_list.forEach((ver) => {
        let option = document.createElement("option");
        option.value = ver;
        option.innerText = ver;
        qfapi_ver_select.append(option);
    });
}