
// The lines enclosed needs to be initialized
const apiUrl = 'https://jsonplaceholder.typicode.com/users';
const config = [
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

const thead = document.getElementById('thead')
const tbody = document.getElementById('tbody')
let sortOrder = 1 //-1 for desc, 1 for asc
let tableData = [];
let sortingColumn = {};

async function fetchApiData(url) {
    return await fetch(url).then((res) => { return res.json() }).then((data) => { return data }).catch((err) => { console.log(err) })
}

function renderTable(theadNode, tbodyNode, configObj, data) {
    if (data.length > 0) {
        createTableHead(theadNode, configObj)
        createTableBody(tbodyNode, configObj, data)
        enableSorting()
    }
}

function createTableHead(theadNode, configObj) {
    let theadDataString = '<tr>';
    configObj.forEach((el) => {
        if (el.isSortable) {
            sortingColumn = el.dataKey
        }
        theadDataString += `<th ${el.isSortable ? 'class="sortable"' : ''}>
            <div>${el.columnName}${el.isSortable ? '<span class="sort-icon">&uarr;&darr;</span>' : ''}</div>
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

function enableSorting() {
    document.querySelectorAll('.sortable').forEach((column) => {
        column.addEventListener('click', function handleClick() {
            sortOrder = sortOrder > 0 ? -1 : 1;
            column.querySelectorAll('.sort-icon')[0].innerHTML = sortOrder > 0 ? '&darr;' : '&uarr;';
            tableData = sortData(tableData)
            createTableBody(tbody, config, tableData)
        });
    });
}

function sortData(data) {
    return data.sort(function (a, b) {
        if (sortOrder > 0)
            return a[sortingColumn].toLowerCase() > b[sortingColumn].toLowerCase() ? 1 : -1
        else if (sortOrder < 0)
            return a[sortingColumn].toLowerCase() < b[sortingColumn].toLowerCase() ? 1 : -1
    })
}

async function init() {
    tableData = await fetchApiData(apiUrl)
    renderTable(thead, tbody, config, tableData)
}

init();