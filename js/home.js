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
  if(severity === 'danger') return '🔴 DANGER — Hatari';
  if(severity === 'warning') return '🟠 WARNING — Tahadhari';

  return '🟡 WATCH — Angalia'
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

//REnder reports
// This takes an array of reports and builds the HTML cards on the page
function renderReports(reports) {
  const reportsList = document.getElementById('reportsList');
  const emptyState = document.getElementById('emptyState')
  const reportCount = document.getElementById('reportCount')

  //updates the stat counters at the top
  const dangerCount = reports.filter(r => r.severity === 'danger').length;
  const warningCount = reports.filter(r => r.severity === 'warning').length;
  const watchCount = reports.filter(r => r.severity === 'watch').length;

  document.getElementById('statDanger').textContent = dangerCount;
  document.getElementById('statWarning').textContent = warningCount;
  document.getElementById('statWatch').textContent = watchCount;
  
  reportCount.textContent = `${reports.length} Active`

  //If there are no reports, show the emptystate message
  if (reports.length === 0) {
    reportsList.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  //sort reports ~ danger first, then warning, then watch
  //within the same severity show the most recent first
  const severityOrder = {danger: 0, warning: 1, watch: 2};
  reports.sort((a,b)=> {
    if(severityOrder [a.severity] !== severityOrder[b.severity]){
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return b.time - a.time;
  });

  //Get list of reports the device has confirmed
  const confirmedIds = JSON.parse(localStorage.getItem('confirmedReports')|| '[]');

  //Build the html card for each report
  reportsList.innerHTML = reports.map((report, index)=> {
    const colors = getSeverityClasses(report.severity);
    const alreadyConfirmed = confirmedIds.includes(report.id);

    return `
      <div class="bg-card border border-border ${colors.border} border-l-4 rounded-2xl p-5 hover:-translate-y-0.5 hover:border-sky transition-all cursor-pointer fade-up"
           style="animation-delay: ${index * 0.07}s">
 
        <!-- Top row: location + severity badge -->
        <div class="flex items-start justify-between gap-3 mb-3">
          <div>
            <p class="font-semibold text-base">📍 ${report.area}</p>
            <p class="text-muted text-xs mt-0.5">${report.county} County</p>
          </div>
          <span class="text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${colors.badge}">
            ${getSeverityLabels(report.severity)}
          </span>
        </div>
 
        <!-- Description -->
        <p class="text-muted text-sm leading-relaxed mb-4">${report.description}</p>
 
        <!-- Bottom row: meta info + confirm button -->
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-4">
            <span class="text-muted text-xs">✅ ${report.confirmations} confirmed</span>
            <span class="text-muted text-xs">🕐 ${timeAgo(report.time)}</span>
            <span class="text-muted text-xs">👤 ${report.reporter}</span>
          </div>
          <button
            id="confirm-${report.id}"
            onclick="confirmReport(${report.id})"
            ${alreadyConfirmed ? 'disabled' : ''}
            class="text-xs font-semibold px-3 py-1.5 rounded-lg border transition
              ${alreadyConfirmed
                ? 'border-border text-muted cursor-not-allowed opacity-50'
                : 'border-sky/30 bg-sky/10 text-sky hover:bg-sky/20 cursor-pointer'}">
            ${alreadyConfirmed ? '✓ Confirmed' : '+ Confirm'}
          </button>
        </div>
 
      </div>
    `;
 }).join('');


 
}

//Confirm a report
//Let users confirm an existing report and prevents the same device from confirming twice using localstorage
function confirmReport(reportId) {
  const confirmedIds = JSON.parse(localStorage.getItem('confirmedReports') || '[]');

  //if alr confirmed do nothing.
  if(confirmedIds.includes(reportId)) return;

  //save to local storage
  confirmedIds.push(reportId);
  localStorage.setItem('confirmedReports', JSON.stringify(confirmedIds));

  //if its a user submited report in the localstorage, increment its confirmations and update severiity when needed
  const storedReports = JSON.parse(localStorage.getItem('floodReports') || '[]');
  const reportIndex = storedReports.findIndex(r => r.id === reportId);

  if(reportIndex !== -1) {
    storedReports[reportIndex].confirmations++;
    
    const confirmCount = storedReports[reportIndex].confirmations;
    if(confirmCount >= 6) storedReports[reportIndex].severity = 'danger';
    else if(confirmCount >= 3) storedReports[reportIndex].severity = 'warning';

    localStorage.setItem('floodReports', JSON.stringify(storedReports));
  }

  //  Update the button immediately without re-rendering everything
  const btn = document.getElementById(`confirm-${reportId}`);
  if(btn) {
    btn.disabled = true;
    btn.textContent = '✓ Confirmed';
    btn.className = 'text-xs font-semibold px-3 py-1.5 rounded-lg border border-border text-muted cursor-not-allowed opacity-50 transition'
  }
}

//filter reports
//runs everytime a user types in the search box or changes a filter
function filterReports() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const selectedCounty = document.getElementById('countyFilter').value;
  const selectedSeverity = document.getElementById('severityFilter').value;

  let reports = getAllReports();

  //filter by search term (matches area, county or description)
  if(searchTerm) {
    reports = reports.filter(report => 
      report.area.toLowerCase().includes(searchTerm) ||
      report.county.toLowerCase().includes(searchTerm) ||
      report.description.toLowerCase().includes(searchTerm)
    );
  }

  //filter county
  if (selectedCounty){
    reports = reports.filter(report => report.county === selectedCounty);
  }

  //filter by severity
  if(selectedSeverity){
    reports = reports.filter(report => report.severity === selectedSeverity);
  }

  renderReports(reports);


}

//Mobile meneu toggle
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('hidden');
  menu.classList.toggle('flex');
}

//Fetching weather from openweather api
//THis fetches live weatcher data for nairobi

async function fetchWeather() {
  const API_KEY = 'fe554f8a2204ce05c44ebc8abeabd693'
  const city = 'Nairobi';



  //api fetch call

  try{
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const mainWeather = data.weather[0].main;
    const emoji = getWeatherEmoji(mainWeather);

    document.getElementById('weatherTemp').textContent = `${temp}°`;
    document.getElementById('weatherIcon').textContent = emoji;
    document.getElementById('weatherDesc').textContent =
      `${description.charAt(0).toUpperCase() + description.slice(1)} in ${city}`;
    document.getElementById('weatherDesc').classList.remove('italic');

    //if its raining change the left border to amber to indicate flood risk
    if(mainWeather === 'Rain' || mainWeather === 'Thunderstorm'){
      document.getElementById('weatherBanner').classList.replace('border-l-sky', 'border-l-amber');
    }


  } catch(error) {
    document.getElementById('weatherDesc').textContent = 'Weather data unavailable right now';

  }
}

//This function converts openweathermapai condition into an emoji
function getWeatherEmoji(condition) {
  const emojiMap = {
    Clear:        '☀️',
    Clouds:       '☁️',
    Rain:         '🌧️',
    Drizzle:      '🌦️',
    Thunderstorm: '⛈️',
    Snow:         '❄️',
    Mist:         '🌫️',
    Fog:          '🌫️',
  };
  return emojiMap[condition] ||  '🌤️';
}

//Initialising the page. THis runs as soon as the page loads
document.addEventListener('DOMContentLoaded', () => {
  renderReports(getAllReports());
  fetchWeather();
});
