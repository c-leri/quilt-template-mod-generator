const GRADLE_VERSIONS = "https://services.gradle.org/versions/all";
const QUILT_META = "https://meta.quiltmc.org/v3";
const QUILT_RELEASE_MAVEN = "https://maven.quiltmc.org/repository/release";

export async function gradle_versions() {
    return await fetch(GRADLE_VERSIONS, {
        method: "GET",
        headers: {
            "Accept": "application/json",
        }
    }).then(async (response) => {
        let json = await response.json();

        return json
            // removes the versions that ends with their build time
            // they can't be downloaded from https://services.gradle.org/distributions
            .filter((gradle_version) => !gradle_version.version.endsWith(gradle_version.buildTime))
            .map((gradle_version) => gradle_version.version);
    }).catch((err) => {
        console.log(err);
        return ["7.2", "7.3.1", "7.3.2", "7.3.3",
            "7.4", "7.4.1", "7.4.2", "7.5",
            "7.5.1", "7.6", "7.6.1", "7.6.2",
            "8.0.2", "8.1", "8.1.1", "8.2",
            "8.2.1", "8.3", "8.4"].reverse();
    });
}


export async function minecraft_versions(stable = true) {
    const url = QUILT_META + "/versions/game";
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });

    let json = await response.json();

    if (stable) {
        json = json.filter((minecraft_version) => minecraft_version.stable);
    }

    const index_of_1_18_2 = json.findIndex((minecraft_version) => minecraft_version.version === "1.18.2");

    // exclude versions prior to 1.18.2
    return json.map((minecraft_version) => minecraft_version.version).slice(0, index_of_1_18_2 + 1);
}


/**
 * @param {string} mc_ver the selected minecraft version
 * @returns {string[]} qfapi versions for the given minecraft versions
 */
export async function qfapi_versions(mc_ver) {
    const url = QUILT_RELEASE_MAVEN + "/org/quiltmc/quilted-fabric-api/quilted-fabric-api/maven-metadata.xml";

    // get all the qfapi versions
    let response = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/xml"
        }
    });

    const xml = await response.text();
    let parser = new DOMParser();
    const doc = parser.parseFromString(xml, "text/xml");

    const versions = Array.from(doc.getElementsByTagName("version")).map((version_element) =>
        version_element.textContent
    );

    return versions
        // get only the version corresponding to the selected minecraft version
        .filter((version) => version.endsWith(mc_ver))
        // sort in inverse alphabetical order
        .sort((a, b) => a.localeCompare(b) * -1);
}


export async function quilt_loader_versions() {
    let url = QUILT_META + "/versions/loader";

    let response = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });

    let json = await response.json();

    return json.map((quilt_loader_version) => quilt_loader_version.version);
}


export async function quilt_mapping_versions(mc_ver) {
    let url = QUILT_META + "/versions/quilt-mappings";
    let response = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });

    let json = await response.json();

    return json
        .filter((quilt_mappings_version) => quilt_mappings_version.gameVersion.toString() === mc_ver)
        .map((quilt_mapping_version) => quilt_mapping_version.version);
}