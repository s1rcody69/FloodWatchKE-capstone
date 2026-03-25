// SAMPLE DATA - just to show hoe the app looks with data
const sampleReports = [
  {
    id: 1,
    area: "Mathare Valley",
    county: "Nairobi",
    description: "Water has entered homes along the riverbank. Roads completely impassable. Residents urged to evacuate immediately.",
    severity: "danger",
    confirmations: 12,
    time: Date.now() - 1000 * 60 * 45,   // 45 minutes ago
    reporter: "Anonymous"
  },
  {
    id: 2,
    area: "Kisumu CBD",
    county: "Kisumu",
    description: "Lake Victoria overflow flooding low-lying streets near the market area. Avoid Oginga Odinga Street.",
    severity: "warning",
    confirmations: 7,
    time: Date.now() - 1000 * 60 * 90,   // 90 minutes ago
    reporter: "James O."
  },
  {
    id: 3,
    area: "Budalang'i",
    county: "Bungoma",
    description: "River banks overflowing. Residents in low-lying areas advised to move to higher ground immediately.",
    severity: "danger",
    confirmations: 18,
    time: Date.now() - 1000 * 60 * 20,   // 20 minutes ago
    reporter: "Anonymous"
  },
  {
    id: 4,
    area: "Kibera",
    county: "Nairobi",
    description: "Drainage channels blocked. Standing water in several lanes. Levels rising steadily since this morning.",
    severity: "warning",
    confirmations: 5,
    time: Date.now() - 1000 * 60 * 120,  // 2 hours ago
    reporter: "Mercy W."
  },
  {
    id: 5,
    area: "Tana Delta",
    county: "Tana River",
    description: "River levels rising. Watch for continued rainfall over the next 12 hours. Stay alert.",
    severity: "watch",
    confirmations: 3,
    time: Date.now() - 1000 * 60 * 200,  // ~3 hours ago
    reporter: "Anonymous"
  },
  {
    id: 6,
    area: "Likoni",
    county: "Mombasa",
    description: "Heavy rainfall causing surface flooding near the ferry crossing area. Use alternative routes.",
    severity: "watch",
    confirmations: 2,
    time: Date.now() - 1000 * 60 * 60,   // 1 hour ago
    reporter: "Ali M."
  }
];
 
//Funtion for getting all reports
//It combines sample reports with any reports a user has submitted and also removes reports older than 24hrs (they have expired)
function getAllReports() {
  const stored = JSON.parse(localStorage.getItem('floodReports') || '[]');

  const now = Date.now();
  const twentyFourHours = 1000 * 60 * 60 * 24;

  //Filter out expired reports
  const activeStored = stored.filter(report => (now - report.time) < twentyFourHours);

  //Saving the cleaned list back to the localStorage
  if(activeStored.length !== stored.length) {
    localStorage.setItem('floodReports', JSON.stringify(activeStored));
  }

  //Return sample reports + user submitted reports
  return [...sampleReports, ...activeStored];

}

//Severity Labels
// Returns  a human-readable label for each severity level including the Kiswahili for every person to understand

function getSeverityLabels(severity) {
  if(severity === 'danger') return 'DANGER — Hatari';
  if(severity === 'warning') return ' WARNING — Tahadhari';

  return  'WATCH — Angalia'
}

//Severity color with tailwindcss classes
function getSeverityClasses(severity) {
  if (severity === 'danger')  return { badge: 'bg-red-500/20 text-red-400',    border: 'border-l-red-500' };
  if (severity === 'warning') return { badge: 'bg-orange-500/20 text-orange-400', border: 'border-l-orange-500' };
  return { badge: 'bg-yellow-500/20 text-yellow-400', border: 'border-l-yellow-500' };
}

//Timestamp for how many minutes ago the report was reported
//Converts a timestamp into a readable string
function timeAgo(timestamp) {
  const diffMs = Date.now() - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'Just now';
  if(diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${diffDays}d ago`;

}

//THis function takes an array of reports and builds the HTML cards into areaReportsList.
function renderAreaReports(reports){
    const areaReportsList = document.getElementById('areaReportsList');
    const areaEmptyState = document.getElementById('areaEmptyState');
    const areaReportCount = document.getElementById('areaReportCount')

    areaReportCount.textContent = `${reports.length} Active`

    //If there are no reports, show the emptystate message
  if (reports.length === 0) {
    areaReportsList.innerHTML = '';
    areaEmptyState.classList.remove('hidden');
    return;


  }
   areaEmptyState.classList.add('hidden');

   //sort reports ~ danger first, then warning, then watch
  //within the same severity show the most recent first
  const severityOrder = {danger: 0, warning: 1, watch: 2};
  reports.sort((a,b)=> {
    if(severityOrder [a.severity] !== severityOrder[b.severity]){
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return b.time - a.time;

   
  });

   areaReportsList.innerHTML = reports.map((report, index)=>{
        const colors =  getSeverityClasses(report.severity);
        return `
  <div class="bg-card border border-border ${colors.border}
              rounded-2xl p-5 hover:-translate-y-0.5 hover:border-sky 
              transition-all fade-up">

    <div class="flex items-start justify-between gap-3 mb-3">
      <div>
        <p class="font-semibold text-base"> ${report.area}</p>
        <p class="text-muted text-xs mt-0.5">${report.county} County</p>
      </div>
      <span class="text-xs font-bold px-3 py-1 rounded-full 
                   whitespace-nowrap ${colors.badge}">
        ${getSeverityLabels(report.severity)}
      </span>
    </div>

    <p class="text-muted text-sm leading-relaxed mb-4">
      ${report.description}
    </p>

    <div class="flex items-center gap-4">
      <span class="text-muted text-xs"> ${report.confirmations} confirmed</span>
      <span class="text-muted text-xs">${timeAgo(report.time)}</span>
      <span class="text-muted text-xs">👤 ${report.reporter}</span>
    </div>

  </div>
`
    }).join('');

}

function filterByCounty(){
    const selectedCounty = document.getElementById('areaCountyFilter').value;

    let reports = getAllReports();

 if (selectedCounty){
    reports = reports.filter(report => report.county === selectedCounty);
  }

  renderAreaReports(reports);



}

//Mobile meneu toggle
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('hidden');
  menu.classList.toggle('flex');
}

// Initialise the page
document.addEventListener('DOMContentLoaded', () => {
  renderAreaReports(getAllReports())
});