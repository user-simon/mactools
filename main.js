function toggleCase(uppercase) {
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
    fmtDelegate(input)
}

function fmtDelegate(input) {
    let raw = input.replace(/[^0-9a-fA-F]/gi, '');
    let groups = document.getElementsByClassName("fmtGroup");
    
    for (let i = 0; i < groups.length; i++) {
        let group = groups[i];
        let group_size = group.dataset.size;

        if (raw.length > group_size) {
            let children = group.children;
            let chunks = raw.match(new RegExp(`.{1,${group_size}}`, 'g'));
    
            group.classList.remove("hide");

            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                let separator = child.dataset.sep;
                child.value = chunks.join(separator);
            }
        } else {
            group.classList.add("hide");
        }
    }
}
