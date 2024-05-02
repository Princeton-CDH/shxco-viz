/*
function to display the iframe embed code and preview it

Call with the id of a container element where the embed and preview should
be added and the string of the embed code to use.

*/
function showEmbedCode(containerId, embedCode) {
    // get the container element where content should be added
    const container = document.getElementById(containerId);

    // create code and preview containers and populate
    const codeDiv = document.createElement('div');
    codeDiv.classList.add('embed-code');
    const codeHeading = document.createElement('h3');
    codeHeading.innerHTML = "embed code";
    codeDiv.append(codeHeading);
    const pre = document.createElement("pre")
    const code = document.createElement("code")
    // display pre-formatted, escaped embed code
    code.innerHTML = embedCode.replace('<', '&lt;');
    pre.append(code);
    codeDiv.append(pre);

        // for preview, add to document as is
    const previewDiv = document.createElement('div');
    codeDiv.classList.add('preview');
    const previewHeading = document.createElement('h3');
    previewHeading.innerHTML = "preview:";
    previewDiv.append(previewHeading);
    // for preview, add to document as is
    const previewContainer = document.createElement("div");
    previewContainer.innerHTML = embedCode;
    previewDiv.append(previewContainer);

    // add preview and code divs to container
    container.append(codeDiv);
    container.append(previewDiv);
}

