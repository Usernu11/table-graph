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

document.addEventListener('click', (e) => {
    const targetData = []
    // let text = ''

    // save data
    if (e.target.classList.contains('name') ||
        e.target.classList.contains('today') ||
        e.target.classList.contains('yesterday') ||
        e.target.classList.contains('week')) {

        targetData.push(e.target.parentNode.querySelector('.name').textContent,
            e.target.parentNode.querySelector('.today').textContent,
            e.target.parentNode.querySelector('.yesterday').childNodes[0].textContent,
            e.target.parentNode.querySelector('.week').textContent)

        // console.log(e.target.parentNode.querySelector('.yesterday').childNodes[0])

        createChart(e.target.parentNode, targetData)

        // e.target.parentNode.querySelector('.yesterday').innerHTML = '<span class="percent"></span>'
        // e.target.parentNode.querySelector('.yesterday .percent').textContent = curPercentValue
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
        }]
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

// sort by name
document.addEventListener('click', (e) => {
    let curValues = []

    if (e.target.classList.contains('names')) {

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

        if (e.target === document.querySelector('.names') && e.target.classList.contains('sorted') !== true) {

            curValues.sort((a, b) => {
                return a.name > b.name ? 1 : -1
            })

            e.target.classList.add('sorted')

        } else if (e.target === document.querySelector('.names') && e.target.classList.contains('sorted') === true) {

            curValues.sort((a, b) => {
                return a.name < b.name ? 1 : -1
            })

            e.target.classList.remove('sorted')
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
            } else if (+newWeek[i].textContent === 4805121) {
                newWeek[i].classList.add('negative')
            }
        }
    }
})

// sort by days
document.addEventListener('click', (e) => {
    let curValues = []

    if (e.target.classList.contains('days')) {

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

        if (e.target === document.querySelector('.days') && e.target.classList.contains('sorted') !== true) {

            curValues.sort((a, b) => {
                return a.today > b.today ? 1 : -1
            })

            e.target.classList.add('sorted')

        } else if (e.target === document.querySelector('.days') && e.target.classList.contains('sorted') === true) {

            curValues.sort((a, b) => {
                return a.today < b.today ? 1 : -1
            })

            e.target.classList.remove('sorted')
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

    }

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
        } else if (+newWeek[i].textContent === 4805121) {
            newWeek[i].classList.add('negative')
        }
    }
})

// sort by weeks
document.addEventListener('click', (e) => {
    let curValues = []

    if (e.target.classList.contains('weeks')) {

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

        if (e.target === document.querySelector('.weeks') && e.target.classList.contains('sorted') !== true) {

            curValues.sort((a, b) => {
                return a.week > b.week ? 1 : -1
            })

            e.target.classList.add('sorted')

        } else if (e.target === document.querySelector('.weeks') && e.target.classList.contains('sorted') === true) {

            curValues.sort((a, b) => {
                return a.week < b.week ? 1 : -1
            })

            e.target.classList.remove('sorted')
        }

        // rewrite table values
        tbody.innerHTML = ''
        curValues.forEach(value => {
            tbody.innerHTML += `
            <tr class="value">
                <td class="name">${value.name.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</td>
                <td class="today number">${value.today.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</td>
                <td class="yesterday number">${value.yesterday.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} <span class="percent">${value.different}</span></td>
                <td class="week number">${value.week.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</td>
            </tr>
            `
        })
    }

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
        console.log(+newWeek[i].textContent)

        if (+newWeek[i].textContent === 32 ||
            +newWeek[i].textContent === 900) {
            newWeek[i].classList.add('positive')
        } else if (+newWeek[i].textContent === 4805121) {
            newWeek[i].classList.add('negative')
        }
    }
})
