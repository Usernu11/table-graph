const number = document.querySelectorAll('.number');
const today = document.querySelector('.today');
const yesterday = document.querySelectorAll('.yesterday');
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
for (let i = 0; i < yesterday.length; i++) {
    const span = document.createElement('span')
    span.classList.add('percent')

    if (percentValues[i] > 0) {
        span.classList.add('percent-positive')
    } else if (percentValues[i] < 0) {
        span.classList.add('percent-negative')
    }

    yesterday[i].appendChild(span)
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
}

// sort by name
document.addEventListener('click', (e) => {
    let curValues = []

    if (e.target.classList.contains('names')) {
        values.forEach(value => {
            // curValues.push(value.querySelector('.name').textContent)
            curValues.push({
                name: value.querySelector('.name').textContent,
                today: value.querySelector('.today').textContent,
                yesterday: value.querySelector('.yesterday').childNodes[0].textContent,
                different: value.querySelector('.yesterday').childNodes[1].textContent,
                week: value.querySelector('.week').textContent
            })
        })

        // curValues.sort()

        // values.forEach(value => {
        //     value.querySelector('.name').textContent = curValues.shift()
        // })


        console.log(curValues)
    }
} 
)