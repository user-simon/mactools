// Process MAC when enter is pressed
document.getElementById("macIn").addEventListener("keyup", ({target, key}) => {
    if (key === "Enter") {
        processRaw(normalizeMac(target.value));
    }
});
// Process MAC if more than 12 valid characters have been entered. Hide output if input is cleared
document.getElementById("macIn").addEventListener("input", ({target}) => {
    let mac = target.value;

    if (mac.length == 0) {
        document.getElementById("output").classList.remove("outputExpand");
    } else {
        let raw = normalizeMac(mac);

        if (raw.length >= 12) {
            processRaw(raw);
        }
    }
});
// Toggle case on all MAC-addresses
document.getElementById("toggleCase").addEventListener("click", (() => {
    let staticToggle = false;

    return ({target}) => {
        staticToggle = !staticToggle;
        let textTransform = (() => {
            if (staticToggle) {
                return "uppercase";
            } else {
                return "lowercase";
            }
        })();
        let outputs = document.getElementsByClassName("mac");
        
        for (let i = 0; i < outputs.length; i++) {
            outputs[i].style.textTransform = textTransform;
        }
        target.style.textTransform = textTransform;
    }
})());

// Removes all non-hex characters from input
function normalizeMac(mac) {
    return mac.replace(/[^0-9a-fA-F]/gi, '');
}

// Performs and displays formatting and vendor query
function processRaw(raw) {
    document.getElementById("output").classList.add("outputExpand");

    format(raw);
    vendorQuery(raw);
}

// Performs and displays all MAC formatting
function format(raw) {
    document.getElementById("macIn").value = raw;
    let groups = document.getElementsByClassName("formatGroup");
    
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

// Performs query for MAC vendor from maclookup.app
function vendorQuery(raw) {
    if (raw.length >= 6) {
        document.getElementById("vendorOut").innerHTML = "";

        let prefix = raw.slice(0, 6);
        console.log(`Querying prefix ${prefix }...`);
        
        // perform jsonp query of mac vendor
        let script = document.createElement('script');
        script.src = `https://api.maclookup.app/v2/macs/${prefix}?format=jsonp&callback=vendorReceive`;
        document.querySelector('head').appendChild(script);
        script.parentNode.removeChild(script);
    } else {
        document.getElementById("vendorOut").innerHTML = "✖ MAC too short";
    }
}

// Receives response after vendorQuery
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
