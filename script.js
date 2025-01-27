let assets = []; 
let isEditing = false;

async function fetchAssets() {
    const response = await fetch('http://localhost:3000/api/assets');
    return response.json();
}

async function addAsset(asset) {
    const response = await fetch('http://localhost:3000/api/assets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(asset)
    });

    return response.json();
}

function renderTable(assets) {
    const tableBody = document.getElementById('assetsTableBody');
    tableBody.innerHTML = '';

    assets.forEach((asset, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${asset.ID}</td>
            <td>${asset.Tipo}</td>
            <td>${asset["Modelo/Marca"]}</td>
            <td>${asset["Número de série"]}</td>
            <td>${asset["Usuário Responsável"]}</td>
            <td>${asset.Localização}</td>
            <td>${asset.Status}</td>
            <td>${asset["Estado do equipamento"]}</td>
            <td>
                <button onclick="editAsset(${index})">Editar</button>
                <button class="delete" onclick="deleteAsset(${index})">Excluir</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function filterAssets(assets, query) {
    return assets.filter(asset =>
        asset.ID.toLowerCase().includes(query) ||
        asset.Tipo.toLowerCase().includes(query) ||
        asset["Usuário Responsável"].toLowerCase().includes(query)
    );
}

function clearForm() {
    document.getElementById('assetForm').reset();
    document.getElementById('editIndex').value = '';
    document.getElementById('formTitle').textContent = 'Adicionar Novo Ativo';
    isEditing = false;
}

async function updateAsset(asset) {
    const response = await fetch(`http://localhost:3000/api/assets/${asset.ID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(asset)
    });

    return response.json();
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const asset = {
        ID: document.getElementById('assetID').value,
        Tipo: document.getElementById('assetType').value,
        "Modelo/Marca": document.getElementById('assetModel').value,
        "Número de série": document.getElementById('assetSerial').value,
        "Usuário Responsável": document.getElementById('assetUser').value,
        Localização: document.getElementById('assetLocation').value,
        Status: document.getElementById('assetStatus').value,
        "Estado do equipamento": document.getElementById('assetCondition').value,
    };

    const editIndex = document.getElementById('editIndex').value;

    if (editIndex) {
        await updateAsset(asset); 
        assets[editIndex] = asset; 
    } else {
        await addAsset(asset); 
        assets.push(asset); 
    }

    renderTable(assets);
    clearForm();
}

async function editAsset(index) {
    const asset = assets[index];
    
    document.getElementById('assetID').value = asset.ID;
    document.getElementById('assetType').value = asset.Tipo;
    document.getElementById('assetModel').value = asset["Modelo/Marca"];
    document.getElementById('assetSerial').value = asset["Número de série"];
    document.getElementById('assetUser').value = asset["Usuário Responsável"];
    document.getElementById('assetLocation').value = asset.Localização;
    document.getElementById('assetStatus').value = asset.Status;
    document.getElementById('assetCondition').value = asset["Estado do equipamento"];

    document.getElementById('editIndex').value = index;

    document.getElementById('formTitle').textContent = 'Editar Ativo';
}

async function deleteAsset(index) {
    const assetID = assets[index].ID;

    const response = await fetch(`http://localhost:3000/api/assets/${assetID}`, {
        method: 'DELETE',
    });

    if (response.status === 204) {
        assets.splice(index, 1);
        renderTable(assets);
    } else {
        alert('Erro ao excluir o ativo. Verifique se o ativo existe.');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    assets = await fetchAssets(); 
    renderTable(assets);

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filteredAssets = filterAssets(assets, query);
        renderTable(filteredAssets);
    });

    document.getElementById('assetForm').addEventListener('submit', handleFormSubmit);
});