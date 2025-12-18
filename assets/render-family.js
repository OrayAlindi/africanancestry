async function loadFamily() {
  const peopleRes = await fetch('/data/people.json');
  const relRes = await fetch('/data/relationships.json');

  const people = await peopleRes.json();
  const relationships = await relRes.json();

  const peopleById = {};
  people.forEach(p => peopleById[p.id] = p);

  // Build generations manually for now (v1 logic)
  const gen1 = people.filter(p => p.id === "KE-0001");
  const gen2 = relationships
    .filter(r => r.from === "KE-0001")
    .map(r => peopleById[r.to]);

  const gen3 = relationships
    .filter(r => gen2.map(p => p.id).includes(r.from))
    .map(r => peopleById[r.to]);

  renderGeneration("gen1", gen1);
  renderGeneration("gen2", gen2);
  renderGeneration("gen3", gen3);
}

function renderGeneration(containerId, people) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  people.forEach(p => {
    const div = document.createElement('div');
    div.className = 'person';
    div.innerHTML = `
      <strong>${p.name}</strong>
      <div class="meta">
        ${p.ethnicity || '—'} · ${p.region || '—'} · Confidence: ${p.confidence}
      </div>
    `;
    container.appendChild(div);
  });
}

loadFamily();
