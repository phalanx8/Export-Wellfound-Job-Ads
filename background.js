chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: generateCSV,
    });
});

function generateCSV() {
    if (!window.location.href.includes("wellfound.com/jobs")) {
        return;
    }
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
    const csvData = makeCSV(
        makeExport("#main > div.styles_component__VRc0I.styles_white__Nexe6 > div.styles_frame__9S86c > div > div > div.flex.flex-col.relative.w-full > div"));
    const blob = new Blob([csvData], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a')

    // Passing the blob downloading url 
    a.setAttribute('href', url)

    // Setting the anchor tag attribute for downloading
    // and passing the download file name
    a.setAttribute('download', 'download.csv');

    // Performing a download with click
    a.click()
}

