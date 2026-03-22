// Real Kenya county emergency contacts
// Sources: Africa Fire Mission, Nairobi County, HapaKenya (2024-2026)
const countyContacts = [
  {
    county: "Nairobi",
    organisation: "Nairobi Disaster Management",
    phone: "020 222 2181",
    type: "disaster"
  },
  {
    county: "Nairobi",
    organisation: "Nairobi Fire & Rescue HQ",
    phone: "020 234 4599",
    type: "fire"
  },
  {
    county: "Nairobi",
    organisation: "St. John Ambulance",
    phone: "0721 225 285",
    type: "medical"
  },
  {
    county: "Kisumu",
    organisation: "Kisumu County Fire & Rescue",
    phone: "0800 720 575",
    type: "fire"
  },
  {
    county: "Nakuru",
    organisation: "Nakuru County Emergency",
    phone: "0800 724 138",
    type: "disaster"
  },
  {
    county: "Mombasa",
    organisation: "Mombasa County Emergency",
    phone: "0800 720 601",
    type: "disaster"
  },
  {
    county: "Kiambu",
    organisation: "Kiambu County Ambulance",
    phone: "0700 820 227",
    type: "medical"
  },
  {
    county: "Kakamega",
    organisation: "Kakamega County Fire",
    phone: "056 203 1155",
    type: "fire"
  },
  {
    county: "Garissa",
    organisation: "Garissa County Emergency",
    phone: "0774 771 910",
    type: "disaster"
  },
  {
    county: "Baringo",
    organisation: "Baringo County Fire",
    phone: "0705 719 999",
    type: "fire"
  },
  {
    county: "Bungoma",
    organisation: "Bungoma County Fire & Rescue",
    phone: "0799 001 100",
    type: "fire"
  },
  {
    county: "Embu",
    organisation: "Embu County Emergency",
    phone: "0721 304 448",
    type: "fire"
  },
  {
    county: "Turkana",
    organisation: "Turkana County Emergency",
    phone: "0111 623 637",
    type: "disaster"
  },
  {
    county: "Vihiga",
    organisation: "Vihiga County Ambulance",
    phone: "0800 721 205",
    type: "medical"
  },
  {
    county: "Kwale",
    organisation: "Kwale County Fire & Rescue",
    phone: "0790 508 898",
    type: "fire"
  },
  {
    county: "All Counties",
    organisation: "Kenya Red Cross — Nationwide",
    phone: "1199",
    type: "redcross"
  },
  {
    county: "All Counties",
    organisation: "Police / General Emergency",
    phone: "999",
    type: "police"
  },
  {
    county: "All Counties",
    organisation: "E-Plus Medical Services",
    phone: "0700 395 395",
    type: "medical"
  }
];

//returns a colour badge based on the contact type
function getTypeBadge(type) {
  if (type === 'disaster') return { label: 'Disaster', classes: 'bg-orange-500/20 text-orange-400' }
  if (type === 'fire')     return { label: 'Fire & Rescue', classes: 'bg-red-500/20 text-red-400' }
  if (type === 'medical')  return { label: 'Medical', classes: 'bg-green-500/20 text-green-400' }
  if (type === 'redcross') return { label: 'Red Cross', classes: 'bg-sky-500/20 text-sky-400' }
  return { label: 'Police', classes: 'bg-yellow-500/20 text-yellow-400' }
}
 

// Render contacts into countyContacts grid
function renderContacts(contacts){
  const countyContacts = document.getElementById('countyContacts');
  

if(contacts.length === 0){
  countyContacts.innerHTML = '<p class="text-muted text-sm">No contacts found for this county.</p>'
  return
} 

countyContacts.innerHTML = contacts.map(contact => {
  const badge = getTypeBadge(contact.type)
  return `<div class="bg-card border border-border rounded-2xl p-5">
  <div class="flex items-start justify-between gap-3 mb-3">
    <p class="font-semibold text-base">${contact.organisation}</p>
    <span class="text-xs font-bold px-3 py-1 rounded-full ${badge.classes}">
      ${badge.label}
    </span>
  </div>
  <p class="text-muted text-xs mb-3">${contact.county} County</p>
  <a href="tel:${contact.phone}" class="flex items-center gap-2 bg-sky/10 
     border border-sky/30 text-sky font-bold text-sm px-4 py-2 
     rounded-xl hover:bg-sky/20 transition no-underline">
    📞 ${contact.phone}
  </a>
</div>`
}).join('');

}