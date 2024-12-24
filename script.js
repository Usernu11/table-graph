const number = document.querySelectorAll('.number');
const today = document.querySelector('.today');
const yesterday = document.querySelectorAll('.yesterday');
const chartWrapper = document.querySelector('.chart-wrapper');
const tbody = document.querySelector('tbody');

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

document.addEventListener('click', (e) => {
    const targetData = []
    let percent = null
    const span = document.createElement('span')
    span.classList.add('percent')        

    // save percent
    if (e.target.parentNode.querySelector('.percent').classList.contains('percent')) {
        percent = e.target.parentNode.querySelector('.percent').textContent
        e.target.parentNode.parentNode.querySelector('.percent').remove()
        
        console.log(percent)
    }

    // save data
    if (e.target.classList.contains('name') ||
        e.target.classList.contains('today') ||
        e.target.classList.contains('yesterday') ||
        e.target.classList.contains('week')) {

        targetData.push(e.target.parentNode.querySelector('.name').textContent,
            e.target.parentNode.querySelector('.today').textContent,
            e.target.parentNode.querySelector('.yesterday').textContent,
            e.target.parentNode.querySelector('.week').textContent)

        // console.log(targetData)

        createChart(e.target.parentNode,
            targetData)
        
        e.target.parentNode.querySelector('.yesterday').appendChild(span)
        span.textContent = percent
        percent = null
    }
})

// chart snippet
const newChart = (data) => {
    console.log(data)
    console.log(data[0])
    console.log(data[1].split(' ').join(''))
    console.log(data[2])
    console.log(data[3])
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
    console.log(target);
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