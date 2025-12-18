async function loadFamily() {
  const peopleRes = await fetch('/data/people.json');
  const relRes = await fetch('/data/relationships.json');

  const people = await peopleRes.json();
  const relationships = await relRes.json();

  const peopleById = {};
  people.forEach(p => peopleById[p.id] = p);

  // Root = person with highest confidence and source "self"
  const root = people.find(p => p.sources.includes("self"));

  const generations = [];
  generations.push([root]);

  let currentGen = [root];

  while (true) {
    const nextGen = relationships
      .filter(r => currentGen.map(p => p.id).includes(r.from))
      .map(r => peopleById[r.to])
      .filter(Boolean);

    if (nextGen.length === 0) break;

    generations.push(nextGen);
    currentGen = nextGen;
  }

  renderGenerations(generations);
}

function renderGenerations(generations) {
  const container = document.querySelector('.container');

  generations.forEach((gen, index) => {
    const section = document.createElement('div');
    section.className = 'generation';

    const heading = document.createElement('h2');
    heading.textContent = `Generation ${index + 1}`;
    section.appendChild(heading);

    gen.forEach(p => {
      const div = document.createElement('div');
      div.className = 'person';
      div.innerHTML = `
        <strong>${p.name}</strong>
        <div class="meta">
          ${p.sources.join(', ')} · Confidence: ${p.confidence}
        </div>
      `;
      section.appendChild(div);
    });

    container.appendChild(section);
  });
}

loadFamily();

  });
}

loadFamily();
