import './styles/main.css';

const API_URL = 'http://localhost:3000';

const ticketsList = document.getElementById('tickets');
const ticketDetails = document.getElementById('ticket-details');
const detailsDiv = document.getElementById('details');
const backBtn = document.getElementById('back-btn');
const ticketsSection = document.getElementById('tickets-list');
const createForm = document.getElementById('ticket-form');
const createSection = document.getElementById('create-ticket');

async function fetchTickets() {
  try {
    const res = await fetch(`${API_URL}/?method=allTickets`);
    if (!res.ok) {
      throw new Error(`Ошибка HTTP: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    alert('Ошибка при загрузке тикетов');
    console.error('fetchTickets error:', error);
    return [];
  }
}

async function fetchTicketById(id) {
  try {
    const res = await fetch(`${API_URL}/?method=ticketById&id=${id}`);
    if (!res.ok) {
      throw new Error(`Ошибка HTTP: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    alert('Ошибка при загрузке тикета');
    console.error('fetchTicketById error:', error);
    return null;
  }
}

function renderTickets(tickets) {
  ticketsList.innerHTML = '';
  if (tickets.length === 0) {
    ticketsList.innerHTML = '<li>Тикетов нет</li>';
    return;
  }

  tickets.forEach(ticket => {
    const li = document.createElement('li');
    li.textContent = `[${ticket.id}] ${ticket.name} - ${ticket.status ? 'Закрыт' : 'Открыт'}`;
    li.style.cursor = 'pointer';
    li.addEventListener('click', () => showTicketDetails(ticket.id));
    ticketsList.appendChild(li);
  });
}

async function showTicketDetails(id) {
  const ticket = await fetchTicketById(id);
  if (!ticket) return;

  ticketsSection.style.display = 'none';
  createSection.style.display = 'none';
  ticketDetails.style.display = 'block';

  detailsDiv.innerHTML = `
    <p><strong>ID:</strong> ${ticket.id}</p>
    <p><strong>Название:</strong> ${ticket.name}</p>
    <p><strong>Описание:</strong> ${ticket.description}</p>
    <p><strong>Статус:</strong> ${ticket.status ? 'Закрыт' : 'Открыт'}</p>
    <p><strong>Создан:</strong> ${new Date(ticket.created).toLocaleString()}</p>
  `;
}

backBtn.addEventListener('click', () => {
  ticketDetails.style.display = 'none';
  ticketsSection.style.display = 'block';
  createSection.style.display = 'block';
});

createForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(createForm);
  const data = {
    name: formData.get('name').trim(),
    description: formData.get('description').trim(),
    status: formData.get('status') === 'true'
  };

  if (!data.name || !data.description) {
    alert('Пожалуйста, заполните все обязательные поля.');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/?method=createTicket`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      throw new Error(`Ошибка HTTP: ${res.status}`);
    }

    const newTicket = await res.json();
    alert(`Тикет создан с ID: ${newTicket.id}`);

    createForm.reset();
    loadTickets();
  } catch (error) {
    alert('Ошибка при создании тикета');
    console.error('createTicket error:', error);
  }
});

async function loadTickets() {
  const tickets = await fetchTickets();
  renderTickets(tickets);
}

loadTickets();
