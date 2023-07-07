const wellfound = "https://www.wellfound.com/jobs/";
chrome.action.onClicked.addListener(async (tab) => {
    chrome.action.onClicked.addListener((tab) => {
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: ['content.js']
        });
    });
});


function generateCSV() {
    // Return the CSV data as a string
    const companyHeaderSelector = ".styles_headerContainer__GfbYF"
    const companySelector = "h2.styles_name__zvQcy"
    const jobDescSelector = ".styles_component__Ey28k"

    const makeObject = (selector) => {
        return {
            company: selector.querySelector(companyHeaderSelector)
                ?.querySelector(companySelector)?.textContent,
            jobDescription: [...selector.querySelectorAll(jobDescSelector)]
                .map((element) => {
                    const anchorElements = [...element.querySelectorAll("a")];
                    const hrefValues = anchorElements.map((anchor) => anchor.href);
                    return hrefValues.join("; ");
                }),
        };
    };


    const makeExport = (selector) => {
        const globalSelector = selector.replace(/:nth-child\(4\)/g, "");
        const rawElements = [...document.querySelectorAll(globalSelector)]
        const exportObjects = rawElements.map(ad => {
            return {
                ...makeObject(ad)
            }
        }).filter(item => item.company !== undefined && item.company !== null)
        return exportObjects
    }

    const makeCSV = (jsonObjects) => {
        let csvContent = "Link,Company\n";

        jsonObjects.forEach((obj) => {
            const {company, jobDescription} = obj;
            jobDescription.forEach((desc) => {
                csvContent += `"${desc}",${company}\n`;
            });
        });

        return csvContent;
    };
    return makeCSV(
        makeExport("#main > div.styles_component__VRc0I.styles_white__Nexe6 > div.styles_frame__9S86c > div > div > div.flex.flex-col.relative.w-full > div:nth-child(4)"));
}

function downloadCSV(csvData) {
    const blob = new Blob([csvData], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    chrome.downloads.download({
        url: url,
        filename: 'data.csv'
    });
}


