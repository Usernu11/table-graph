const number = document.querySelectorAll('.number');
const today = document.querySelector('.today');
const newYesterday = document.querySelectorAll('.yesterday');
const chartWrapper = document.querySelector('.chart-wrapper');
const tbody = document.querySelector('tbody');
const values = document.querySelectorAll('.value');

const percentValues = [4, 0, 0, 0, 44, 50, -9, 0, -6, -6]

// format number
number.forEach(element => {
    const numbefy = +element.textContent
    const formatedNumber = numbefy.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    const span = document.createElement('span')

    element.textContent = formatedNumber
});

// create %
for (let i = 0; i < newYesterday.length; i++) {
    const span = document.createElement('span')
    span.classList.add('percent')

    if (percentValues[i] > 0) {
        span.classList.add('percent-positive')
    } else if (percentValues[i] < 0) {
        span.classList.add('percent-negative')
    }

    newYesterday[i].appendChild(span)
    span.textContent = `${percentValues[i]}%`
}

// let curPercentValue = null
// let curNumber = null

// save data
document.addEventListener('click', (e) => {
    const targetData = []

    // save data
    if (e.target.classList.contains('name') ||
        e.target.classList.contains('today') ||
        e.target.classList.contains('yesterday') ||
        e.target.classList.contains('week')) {

        // error here
        targetData.push(
            e.target.parentNode.querySelector('.name').textContent,
            e.target.parentNode.querySelector('.today').textContent,
            e.target.parentNode.querySelector('.yesterday').childNodes[0].textContent,
            e.target.parentNode.querySelector('.week').textContent
        )

        createChart(e.target.parentNode, targetData)
    }
})

// chart snippet
const newChart = (data) => {
    // console.log(data)
    // console.log(data[0])
    // console.log(data[1].split(' ').join(''))
    // console.log(data[2])
    // console.log(data[3])
    const chart = Highcharts.chart('chart', {
        chart: {
            type: 'line'
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: ['Текущий день', 'Вчера', 'Этот день недели']
        },
        yAxis: {
            title: {
                text: `${data[0]}`
            }
        },
        series: [{
            name: '',
            data: [+data[1].split(' ').join(''), +data[2].split(' ').join(''), +data[3].split(' ').join('')]
        }],
        accessibility: {
            point: {
                valueSuffix: `${data[0]}`
            }
        }
    });
}

const createChart = (target, data) => {
    // console.log(target);
    const newRow = document.createElement('tr')

    if (document.querySelector('.chart-wrapper')) {
        document.querySelector('.chart-wrapper').remove()
    }

    newRow.classList.add('chart-wrapper')
    newRow.innerHTML = `
        <td class="chart" id="chart" colspan="4"></td>
    `

    target.after(newRow)
    newChart(data)

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// save table data and sorting
const sortFunction = (target, title, sortParam) => {
    let curValues = []
    let titleName = title.replace('.', '')

    // console.log('target', target)
    // console.log('doc.qs(title)', document.querySelector(title))
    // console.log('target === doc.qs(title)', target === document.querySelector(title))
    // console.log('target.classList', target.classList)
    // console.log('title', title.replace('.', ''))
    // console.log(target.classList.contains(titleName))
    
    if (target.classList.contains(titleName)) {

        // console.log(values[0].name.value)
        // console.log(values[0].querySelector('.name').textContent)
        values.forEach(value => {
            curValues.push({
                name: value.querySelector('.name').textContent,
                today: +value.querySelector('.today').textContent.replaceAll(' ', ''),
                yesterday: +value.querySelector('.yesterday').childNodes[0].textContent.replaceAll(' ', ''),
                different: value.querySelector('.yesterday').childNodes[1].textContent,
                week: +value.querySelector('.week').textContent.replaceAll(' ', ''),
                weekClasss: value.querySelector('.week').classList
            })
        })

        // console.log(sortParam)
        // console.log(curValues[0].sortParam)


        // console.log(curValues[0].name)  // выручка 📍
        // console.log(target)
        // console.log(document.querySelector(title))
        // console.table(curValues)
        // console.log(target.classList.toString())

        if (
            target === document.querySelector(title) && 
            target.classList.contains('sorted') !== true
            ) {
                // sort by ascending
                curValues.sort((a, b) => {
                return a[sortParam] > b[sortParam] ? 1 : -1
            })

            target.classList.add('sorted')
        } else if (
            target === document.querySelector(title) &&
            target.classList.contains('sorted') === true
            ) {

            // sort by descending
            curValues.sort((a, b) => {
                return a[sortParam] < b[sortParam] ? 1 : -1
            })

            target.classList.remove('sorted')
        }

        // rewrite table values
        tbody.innerHTML = ''
        curValues.forEach(value => {

            // toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") ---> format number ↓
            // 4000000 to 4 000 000
            tbody.innerHTML += `
            <tr class="value">
                <td class="name">${value.name.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</td>
                <td class="today number">${value.today.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</td>
                <td class="yesterday number">${value.yesterday.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} <span class="percent">${value.different}</span></td>
                <td class="week number">${value.week.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</td>
            </tr>
            `
        })

       updateCellStyles()
    }
}

// sort listener
document.addEventListener('click', (e) => {

    if (e.target.classList.contains('names')) {
        sortFunction(e.target, '.names', 'name')
    } else if (e.target.classList.contains('days')) {
        sortFunction(e.target, '.days', 'today')
    } else if (e.target.classList.contains('yesterday-title')) {
        sortFunction(e.target, '.yesterday-title', 'yesterday')
    } else if (e.target.classList.contains('weeks')) {
        sortFunction(e.target, '.weeks', 'week')
    }

})

const updateCellStyles = () => {
     // color yesterday cells (create classes for yesterday)
     let newYesterday = document.querySelectorAll('.yesterday')

     for (let i = 0; i < newYesterday.length; i++) {
         if (newYesterday[i].childNodes[1].textContent.slice(0, -1) > 0) {
             newYesterday[i].classList.add('positive')
         } else if (newYesterday[i].childNodes[1].textContent.slice(0, -1) < 0) {
             newYesterday[i].classList.add('negative')
         }
     }

     // color percents (create classes for percents)
     let newPercent = document.querySelectorAll('.percent')

     for (let i = 0; i < newPercent.length; i++) {
         if (newPercent[i].textContent.slice(0, -1) > 0) {
             newPercent[i].classList.add('percent-positive')
         } else if (newPercent[i].textContent.slice(0, -1) < 0) {
             newPercent[i].classList.add('percent-negative')
         }
     }

     // color week cells (create classes for week)
     let newWeek = document.querySelectorAll('.week')

     for (let i = 0; i < newWeek.length; i++) {
         // 32, 900, 4805121 - just for example
         if (+newWeek[i].textContent === 32 ||
             +newWeek[i].textContent === 900) {
             newWeek[i].classList.add('positive')
         } else if (+newWeek[i].textContent.replaceAll(' ', '') === 4805121) {
             newWeek[i].classList.add('negative')
         }
     }
}

// 15:12
// 468 lines (not optimized)
// 242 lines (optimized)
// 226 lines removed