//Function for submitting the report
function submitReport(event) {
    event.preventDefault();

    //Reading the form values
    const name = document.getElementById('reporterName').value.trim();
    const area = document.getElementById('reportArea').value.trim();
    const county = document.getElementById('reportCounty').value.trim();
    const description = document.getElementById('reportDescription').value.trim();

    const severityInput = document.querySelector('input[name="severity"]:checked');
    const severity = severityInput ? severityInput.value : '';

    //Validation of inputs making sure every feild has values and if not stop the submition ans tell the user what is wrong
    if(!area) {
        alert ("Please enter your area or neighbourhood")
        return;
    } else if(!county) {
        alert("Please select your county")
        return;
    } else if(!description) {
        alert("Please describe what is happening")
        return;

    } else if(!severity) {
        alert("Please select a severity level")
        return;
    }

    //An object of Reports
    const newReport = {
        id: Date.now(),
        area:  area ,
        county: county ,
        description:  description ,
        severity: severity  ,
        reporter: name ? name : 'Anonymous' ,
        confirmations: 0  ,
        time: Date.now() 

    }

    //Saving UPDATED ARRAY back to localstorage
    //Gets existing reports array from localstorage and if nothing is there use an empty array. 
    const existing = JSON.parse(localStorage.getItem('floodReports') || '[]');
    existing.push(newReport);
    localStorage.setItem('floodReports', JSON.stringify(existing));

    window.location.href = 'index.html'
}

//Function for hamburger button
function toggleMenu(){
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
    menu.classList.toggle('flex');
}