function setFmtCase(uppercase) {
    let outputs = document.getElementsByClassName("fmtOut");
    let textTransform;

    if (uppercase) {
        textTransform = "uppercase";
    } else {
        textTransform = "lowercase";
    }

    for (let i = 0; i < outputs.length; i++) {
        outputs[i].style.textTransform = textTransform;
    }
}

function onUpdate(input) {
    let raw = updateFmt(input);
    
    if (raw.length >= 6) {
        queryVendor(raw.slice(0, 6));
    }
}

function updateFmt(input) {
    let raw = input.replace(/[^0-9a-fA-F]/gi, '');
    let groups = document.getElementsByClassName("fmtGroup");
    
    for (let i = 0; i < groups.length; i++) {
        let group = groups[i];
        let grouping_size = group.dataset.grouping;

        if (raw.length > grouping_size) {
            let children = group.children;
            let groupings = raw.match(new RegExp(`.{1,${grouping_size}}`, 'g'));
    
            group.classList.remove("hide");

            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                let separator = child.dataset.sep;
                child.value = groupings.join(separator);
            }
        } else {
            group.classList.add("hide");
        }
    }
    return raw;
}

function queryVendor(mac) {
    console.log("Making query...");
    let script = document.createElement('script');
    script.src = `https://api.maclookup.app/v2/macs/${mac}?format=jsonp&callback=vendorReceive`;
    document.querySelector('head').appendChild(script);
    script.parentNode.removeChild(script);
}

function vendorReceive(response) {
    document.getElementById("queryResult").innerHTML = response.company;
}
