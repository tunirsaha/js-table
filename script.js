
// The lines enclosed needs to be initialized
var apiUrl = 'https://jsonplaceholder.typicode.com/users';
var config = [
    {
        dataKey: 'id',
        columnName: 'ID'
    },
    {
        dataKey: 'name',
        columnName: 'Name',
        isSortable: true
    },
    {
        dataKey: 'phone',
        columnName: 'Phone'
    },
    {
        dataKey: 'email',
        columnName: 'Email'
    }
];
// The lines enclosed needs to be initialized 

var thead = document.getElementById('thead')
var tbody = document.getElementById('tbody')
var sortableColumns = document.getElementsByClassName('sortable')

async function fetchApiData(url) {
    return await fetch(url).then((res) => { return res.json() }).then((data) => { return data }).catch((err) => { this.showError(err) })
}

function renderTable(theadNode, tbodyNode, configObj, data) {
    if (data.length > 0) {
        createTableHead(theadNode, configObj)
        createTableBody(tbodyNode, configObj, data)
    }
}

function createTableHead(theadNode, configObj) {
    let theadDataString = '<tr>';
    configObj.forEach((el) => {
        theadDataString += `<th>
            <div ${el.isSortable ? 'class="sortable"' : ''}>${el.columnName}${el.isSortable ? '<span class="sort-icon">&uarr;&darr;</span>' : ''}</div>
        </th>`
    })
    theadDataString += '</tr>';
    theadNode.innerHTML = theadDataString
}

function createTableBody(tbodyNode, configObj, data) {
    let tBodyDataString = '';
    data.forEach((el) => {
        tBodyDataString += '<tr>';
        configObj.forEach((col) => {
            tBodyDataString += `<td>${el[col.dataKey]}</td>`
        })
        tBodyDataString += '</tr>';
    })
    tbodyNode.innerHTML = tBodyDataString
}

(async function () {
    renderTable(this.thead, this.tbody, this.config, await fetchApiData(apiUrl))
})();