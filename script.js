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
    clearScreen()
    API_URL = document.getElementById('apiInput').value
    try {
        TABLE_CONFIG = JSON.parse(document.getElementById('configInput').value)
        loadData()
    } catch (e) {
        alert('You have an error in your JSON')
        resetScreen()
    }
}

async function loadData() {
    TABLE_DATA = await fetchApiData(API_URL)
    renderTable(TABLE_DATA)
}

async function fetchApiData(_url) {
    return await fetch(_url)
        .then((_res) => { return _res.json() })
        .then((_data) => { return _data })
        .catch((_err) => { console.log(_err) })
}

function renderTable(_data) {
    if (_data.length > 0) {
        createTableHead()
        createTableBody(_data)
        enableSorting()
    }
}

function createTableHead() {
    let _theadDataString = '<tr>';
    TABLE_CONFIG.forEach((el) => {
        if (el.isSortable) {
            SORT_COLUMN = el.dataKey
        }
        _theadDataString += `<th ${el.isSortable ? 'class="sortable"' : ''}>
            <div>${el.columnName}${el.isSortable ? '<span class="sort-icon">&uarr;&darr;</span>' : ''}</div>
        </th>`
    })
    _theadDataString += '</tr>';
    THEAD.innerHTML = _theadDataString
}

function createTableBody(_data) {
    let _tBodyDataString = ''
    _data.forEach((_el) => {
        _tBodyDataString += '<tr>'
        TABLE_CONFIG.forEach((_col) => {
            let _colValue = _col.dataKey
            if (_col.dataKey.includes('.')) {
                _colValue = scanNestedKeyValue(_el, _col.dataKey)
            }
            _tBodyDataString += `<td>${_colValue}</td>`
        })
        _tBodyDataString += '</tr>'
    })
    TBODY.innerHTML = _tBodyDataString
}

function scanNestedKeyValue(_dataRow, _colKey) {
    let _tempColKey = _colKey
    let _tempDataRow = _dataRow
    let _keyArr = []
    do {
        _keyArr = _tempColKey.split('.')
        _tempDataRow = _tempDataRow[_keyArr[0]]
        _keyArr.shift()
        _tempColKey = _keyArr.join('.')
    } while (_keyArr.length > 0)
    return _tempDataRow;
}

function enableSorting() {
    document.querySelectorAll('.sortable').forEach((_col) => {
        _col.addEventListener('click', function handleClick() {
            SORT_ORDER = SORT_ORDER > 0 ? -1 : 1
            _col.querySelectorAll('.sort-icon')[0].innerHTML = SORT_ORDER > 0 ? '&darr;' : '&uarr;'
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

function clearScreen() {
    THEAD.innerHTML = ''
    TBODY.innerHTML = ''
    SORT_COLUMN = ''
    API_URL = ''
    TABLE_CONFIG = {}
    SORT_ORDER = 1
}

function resetScreen() {
    clearScreen()
    initSettings()
}