const GRADLE_VERSIONS = "https://services.gradle.org/versions/all";
const QUILT_META = "https://meta.quiltmc.org/v3";
const QUILT_RELEASE_MAVEN = "https://maven.quiltmc.org/repository/release";
const QUILT_SNAPSHOT_MAVEN = "https://maven.quiltmc.org/repository/snapshot";

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
    let response = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });

    let json = await response.json();

    if (stable) {
        json = json.filter((minecraft_version) => minecraft_version.stable);
    }

    return json.map((minecraft_version) => minecraft_version.version);
}


/**
 * @param {string[]} mc_vers a list of minecraft versions (the first one should be the selected one) 
 * @returns {string[]} qfapi versions for the given minecraft versions
 */
export async function qfapi_versions(mc_vers) {
    const urls = [
        QUILT_RELEASE_MAVEN + "/org/quiltmc/quilted-fabric-api/quilted-fabric-api/maven-metadata.xml",
        QUILT_SNAPSHOT_MAVEN + "/org/quiltmc/quilted-fabric-api/quilted-fabric-api/maven-metadata.xml"
    ];

    // get all the qfapi versions
    let all_versions = [];
    await Promise.all(
        urls.map(async (url) => {
            let response = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/xml"
                }
            });

            const xml = await response.text();
            let parser = new DOMParser();
            const doc = parser.parseFromString(xml, "text/xml");

            Array.from(doc.getElementsByTagName("version")).map((version_element) =>
                all_versions.push(version_element.textContent)
            )
        })
    );

    // get versions that match the latest minecraft version
    // or the one before if none match
    // or the one before that, etc
    let versions = [];
    for (let i = 0; i < mc_vers.length && versions.length < 1; i++) {
        versions = all_versions.filter((version) =>
            version.endsWith(mc_vers[i]) || version.endsWith(mc_vers[i] + "-SNAPSHOT")
        );
    }

    // sort in inverse alphabetical order
    return versions.sort((a, b) =>
        a.localeCompare(b) * -1
    );
}

/**
 * @param {string[]} mc_vers a list of minecraft versions (the first one should be the selected one) 
 * @returns {string[]} qsl versions for the given minecraft versions
 */
export async function qsl_versions(mc_vers) {
    const urls = [
        QUILT_RELEASE_MAVEN + "/org/quiltmc/qsl/maven-metadata.xml",
        QUILT_SNAPSHOT_MAVEN + "/org/quiltmc/qsl/maven-metadata.xml"
    ]

    // get all the qsl versions
    let all_versions = [];
    await Promise.all(
        urls.map(async (url) => {
            let response = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/xml"
                }
            });

            const xml = await response.text();
            let parser = new DOMParser();
            const doc = parser.parseFromString(xml, "text/xml");

            Array.from(doc.getElementsByTagName("version")).map((version_element) =>
                all_versions.push(version_element.textContent)
            )
        })
    );

    // get versions that match the latest minecraft version
    // or the one before if none match
    // or the one before that, etc
    let versions = [];
    for (let i = 0; i < mc_vers.length && versions.length < 1; i++) {
        versions = all_versions.filter((version) =>
            version.endsWith(mc_vers[i]) || version.endsWith(mc_vers[i] + "-SNAPSHOT")
        );
    }

    // sort in inverse alphabetical order
    return versions.sort((a, b) =>
        a.localeCompare(b) * -1
    );
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