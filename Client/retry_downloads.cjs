const fs = require('fs');
const https = require('https');

const diagrams = {
  "Level1_ReliefCamp": `graph LR
classDef process fill:#fff,stroke:#333,stroke-width:1px;
classDef entity fill:#fff,stroke:#333,stroke-width:1px;
CampL[Relief Camp]:::entity
CampR[Relief Camp]:::entity
P1((1.0<br/>Registration)):::process
P2((2.0<br/>Authentication)):::process
P3((3.0<br/>Manage Profile)):::process
P4((4.0<br/>Report Disaster)):::process
P5((5.0<br/>Create<br/>New Request)):::process
P6((6.0<br/>View Requests<br/>List)):::process
CampL -- Registration Details --> P1
P1 -- Registration Successful --> CampR
CampL -- Login Details --> P2
P2 -- Authentication successful --> CampR
CampL -- Profile Updates --> P3
P3 -- Update Successful --> CampR
CampL -- Disaster Details --> P4
P4 -- Report Successful --> CampR
CampL -- Item/Volunteer Req Details --> P5
P5 -- Request Successful --> CampR
CampL -- Query --> P6
P6 -- Details Successful --> CampR`,

  "Level1_Volunteer": `graph LR
classDef process fill:#fff,stroke:#333,stroke-width:1px;
classDef entity fill:#fff,stroke:#333,stroke-width:1px;
VolL[Volunteer]:::entity
VolR[Volunteer]:::entity
P1((1.0<br/>Registration)):::process
P2((2.0<br/>Authentication)):::process
P3((3.0<br/>Manage Profile)):::process
P4((4.0<br/>View<br/>Assignments)):::process
P5((5.0<br/>View<br/>Open Requests)):::process
P6((6.0<br/>Disaster<br/>Gallery & Feedback)):::process
VolL -- Registration Details --> P1
P1 -- Registration Successful --> VolR
VolL -- Login Details --> P2
P2 -- Authentication successful --> VolR
VolL -- Profile Updates --> P3
P3 -- Update Successful --> VolR
VolL -- Query --> P4
P4 -- Details Successful --> VolR
VolL -- Accept/Update Needs --> P5
P5 -- Update Successful --> VolR
VolL -- Query --> P6
P6 -- Details Successful --> VolR`
};

const entries = Object.entries(diagrams);

function downloadNext(index) {
  if (index >= entries.length) {
    console.log("All done");
    return;
  }
  const name = entries[index][0];
  const code = entries[index][1];
  
  const state = { code, mermaid: '{"theme":"default"}', autoSync: true, updateDiagram: true };
  const base64 = Buffer.from(JSON.stringify(state)).toString('base64');
  const url = 'https://mermaid.ink/img/' + base64 + '?type=png&bgColor=!white';
  
  console.log('Downloading ' + name + '...');
  https.get(url, (res) => {
    if (res.statusCode !== 200) {
        console.error('Failed to download ' + name + ': HTTP ' + res.statusCode);
        setTimeout(() => downloadNext(index + 1), 3000);
        return;
    }
    const file = fs.createWriteStream('d:/CrisisAid/Client/' + name + '.png');
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Saved ' + name + '.png');
      setTimeout(() => downloadNext(index + 1), 3000);
    });
  }).on('error', (err) => {
    console.error('Error downloading ' + name + ': ', err.message);
    setTimeout(() => downloadNext(index), 3000); // retry same index on connection error
  });
}

downloadNext(0);
