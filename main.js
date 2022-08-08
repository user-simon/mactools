function fmtMAC(input, separator, group_size) {
    let regex = new RegExp(`.{1,${group_size}}`, 'g');
    return input.match(regex).join(separator)
}

function onMACUpdate(input) {
    if (input.length > 0) {
        if (document.getElementById("uppercase").checked) {
            processMAC(input.toUpperCase())
        } else {
            processMAC(input.toLowerCase())
        }
    }
}

function hideGroup(group_size) {
    document.getElementById(group_size).hidden = true;
}

function showFmtGroup(raw, group_size) {
    let group = document.getElementById(group_size);
    group.hidden = false;
    let children = group.children;

    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        let separator = child.dataset.sep;
        child.value = fmtMAC(raw, separator, group_size)
    }
}

function processMAC(input) {
    let raw = input.replace(/[^0-9a-fA-F]/gi, '')

    if (raw.length >= 2) {
        showFmtGroup(raw, 2)

        if (raw.length >= 4) {
            showFmtGroup(raw, 4)
        }
    } else {
        hideGroup(2);
        hideGroup(4);
    }
    if (raw.length % 4 === 0) {
        
    }
    if (raw.length >= 6) {
    }
}
