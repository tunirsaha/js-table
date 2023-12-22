const THEAD = document.getElementById('thead')
const TBODY = document.getElementById('tbody')
const SAMPLE_API_URL = 'https://jsonplaceholder.typicode.com/users'
const SAMPLE_TABLE_CONFIG = `[
    {
        "dataKey": "id",
        "columnName": "ID"
    },
    {
        "dataKey": "name",
        "columnName": "Name",
        "isSortable": true
    },
    {
        "dataKey": "phone",
        "columnName": "Phone"
    },
    {
        "dataKey": "email",
        "columnName": "Email"
    }
]`

let SORT_ORDER = 1 //-1 for desc, 1 for asc
let TABLE_DATA = []
let SORT_COLUMN = ''
let API_URL = ''
let TABLE_CONFIG = {}

initSettings();

function initSettings() {
    document.getElementById('apiInput').value = SAMPLE_API_URL
    document.getElementById('configInput').innerHTML = SAMPLE_TABLE_CONFIG
}

function getUserInput() {
    cleanSlate()
    API_URL = document.getElementById('apiInput').value
    TABLE_CONFIG = JSON.parse(document.getElementById('configInput').value)
    loadData()
}

async function loadData() {
    TABLE_DATA = await fetchApiData(API_URL)
    renderTable(TABLE_DATA)
}

async function fetchApiData(url) {
    return await fetch(url).then((res) => { return res.json() }).then((data) => { return data }).catch((err) => { console.log(err) })
}

function renderTable(data) {
    if (data.length > 0) {
        createTableHead()
        createTableBody(data)
        enableSorting()
    }
}

function createTableHead() {
    let theadDataString = '<tr>';
    TABLE_CONFIG.forEach((el) => {
        if (el.isSortable) {
            SORT_COLUMN = el.dataKey
        }
        theadDataString += `<th ${el.isSortable ? 'class="sortable"' : ''}>
            <div>${el.columnName}${el.isSortable ? '<span class="sort-icon">&uarr;&darr;</span>' : ''}</div>
        </th>`
    })
    theadDataString += '</tr>';
    THEAD.innerHTML = theadDataString
}

function createTableBody(data) {
    let tBodyDataString = ''
    data.forEach((el) => {
        tBodyDataString += '<tr>'
        TABLE_CONFIG.forEach((col) => {
            tBodyDataString += `<td>${el[col.dataKey]}</td>`
        })
        tBodyDataString += '</tr>'
    })
    TBODY.innerHTML = tBodyDataString
}

function enableSorting() {
    document.querySelectorAll('.sortable').forEach((column) => {
        column.addEventListener('click', function handleClick() {
            SORT_ORDER = SORT_ORDER > 0 ? -1 : 1
            column.querySelectorAll('.sort-icon')[0].innerHTML = SORT_ORDER > 0 ? '&darr;' : '&uarr;'
            TABLE_DATA = sortData(TABLE_DATA)
            createTableBody(TABLE_DATA)
        });
    });
}

function sortData(_data) {
    return _data.sort(function (_a, _b) {
        if (SORT_ORDER > 0)
            return _a[SORT_COLUMN].toLowerCase() > _b[SORT_COLUMN].toLowerCase() ? 1 : -1
        else if (SORT_ORDER < 0)
            return _a[SORT_COLUMN].toLowerCase() < _b[SORT_COLUMN].toLowerCase() ? 1 : -1
    })
}

function cleanSlate() {
    THEAD.innerHTML = ''
    TBODY.innerHTML = ''
    SORT_COLUMN = ''
    API_URL = ''
    TABLE_CONFIG = {}
    SORT_ORDER = 1
}
