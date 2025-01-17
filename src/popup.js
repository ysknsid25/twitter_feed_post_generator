document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.local.get(["fixedMessage", "hashTag"], function (val) {
        if (val.fixedMessage) {
            document.getElementById("fixedMessage").value = val.fixedMessage;
        }
        if (val.hashTag) {
            document.getElementById("hashTag").value = val.hashTag;
        }
    });
    document
        .getElementById("saveButton")
        .addEventListener("click", function () {
            const fixedMessage = document.getElementById("fixedMessage");
            const hashTag = document.getElementById("hashTag");
            chrome.storage.local.set({
                fixedMessage: fixedMessage.value,
                hashTag: hashTag.value,
            });
            const savedLabelElm = document.getElementById("savedLabel");
            savedLabelElm.innerHTML = "保存しました!";
            setTimeout(function () {
                savedLabelElm.innerHTML = "";
            }, 1000);
        });
    document
        .getElementById("postButton")
        .addEventListener("click", async function () {
            const [tab] = await chrome.tabs.query({
                active: true,
                currentWindow: true,
            });
            if (tab) {
                const mode = document.getElementsByName("mode");
                let endFix = "";
                for (let i = 0; i < mode.length; i++) {
                    if (mode.item(i).checked) {
                        if (mode.item(i).value) {
                            endFix = "_" + mode.item(i).value;
                        }
                    }
                }
                const fixedMessage =
                    document.getElementById("fixedMessage").value;
                const hashTag = document.getElementById("hashTag").value
                    ? `%23${document.getElementById("hashTag").value}${endFix}`
                    : "";
                const title = tab.title;
                const url = encodeURIComponent(tab.url);
                const text = `${fixedMessage}%20${hashTag}%20%0a%20"${title}"%20%0a`;
                const shareUrl = `https://x.com/intent/post?url=${url}&text=${text}`;
                chrome.tabs.create({ url: shareUrl });
            }
        });
});
