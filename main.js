function setCasing(uppercase) {
    let outputs = document.getElementsByClassName("macOut");
    let textTransform = (() => {
        if (uppercase) {
            return "uppercase";
        } else {
            return "lowercase";
        }
    })();

    for (let i = 0; i < outputs.length; i++) {
        outputs[i].style.textTransform = textTransform;
    }
    document.getElementById("casingLabel").style.textTransform = textTransform;
}

function onKeyDown(event) {
    if (event.key == "Enter") {
        onEnter();
    }
}

function onEnter() {
    document.getElementById("output").classList.add("outputExpand");

    let input = document.getElementById("macIn");
    let raw = format(input.value);
    input.value = raw;
    
    vendorQuery(raw);
}

function format(input) {
    // filter all non-hex characters
    let raw = input.replace(/[^0-9a-fA-F]/gi, '');
    let groups = document.getElementsByClassName("groupOut");
    
    // formatting information is encoded in the HTML for the outputs themselves. Grouping size is
    // defined with attribute "data-groupings" and the separator is defined as "data-sep". iterate
    // over all groupings and then over all separators and display the format output
    for (let i = 0; i < groups.length; i++) {
        let group = groups[i];
        let grouping_size = group.dataset.grouping;

        // hide group if input isn't long enough to cover more than one grouping, as the result
        // would otherwise be meaningless
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

function vendorQuery(mac) {
    if (mac.length >= 6) {
        let prefix = mac.slice(0, 6);
        console.log(`Querying prefix ${prefix }...`);

        let script = document.createElement('script');
        script.src = `https://api.maclookup.app/v2/macs/${prefix}?format=jsonp&callback=vendorReceive`;
        document.querySelector('head').appendChild(script);
        script.parentNode.removeChild(script);
    } else {
        document.getElementById("vendorOut").innerHTML = "✖ MAC too short";
    }
}

function vendorReceive(response) {
    console.log("Query response received");
    document.getElementById("vendorOut").innerHTML = (() => {
        if (!response.success) {
            return "✖ Query failed";
        } else if (!response.found) {
            return "✖ Unknown vendor";
        } else {
            return response.company;
        }
    })();
}
