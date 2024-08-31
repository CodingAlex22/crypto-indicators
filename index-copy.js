const {log, error} = console;




const input = document.querySelector('input');
const submitBtn = document.querySelector('button');

submitBtn.addEventListener('click', function(){
  localStorage.setItem('userinput', input.value.toUpperCase())
  location.reload();
  
})

document.querySelector('#testt').innerText = localStorage.getItem('userinput')

document.getElementById('testselect').onchange = function(){
  localStorage.setItem('userselect', document.getElementById('testselect').value);
  location.reload();
}

document.querySelector('#times').innerText = localStorage.getItem('userselect');





function getCharts() {
    const getData = async () => {
        const url = `https://proxy-server-2i9o.onrender.com/${localStorage.getItem('userinput')}USDT/${localStorage.getItem('userselect')}`
        const resp = await fetch(url);
        const data = await resp.json();
        return data;
    };
    
    //getData();
    
    const renderChart = async () => {
        const chartProperties = {
            timeScale: {
               timeVisible: true,
               secondsVisible: true,
            }, 
            pane:0,
            
        };
        
        const domElement = document.getElementById('tvchart');
        const chart = LightweightCharts.createChart(domElement, 
          {
            layout: {
              backgroundColor: '#141823',
              textColor: 'rgba(255, 255, 255, 0.9)',},  
              timeScale: {
                timeVisible: true,
                secondsVisible: true,
             }, grid: {
              vertLines: {
                color: 'rgba(188, 188, 188, 0.06)',
              },
              horzLines: {
                color: ' rgba(188, 188, 188, 0.06)',
              },
            }, 
            
            pane: 0,
          });

        const klinedata = await getData();
        let filternumbers = klinedata.filter((d) => d.open).map((d) => ({value: d.open}));
        let arrays =  filternumbers.slice(899, 999);
        var results = arrays.map(obj => parseFloat(obj.value));
        const average = results.reduce((a, b) => a + b) / results.length;
        var nine = -Math.floor( Math.log10(average) + 1)
        let precision_number = nine + 4;
        let decimalarr = [0,'.'];
        for(i = 0; i < precision_number - 1; i++){
          decimalarr.push(0);
        }   
        decimalarr.push(1);
        let minMove_number = parseFloat(decimalarr.join(''));
        console.log(precision_number);

        if (precision_number <= 0){
            precision_number = 2;
            minMove_number = 0.01;
        }

        
        const candleseries = chart.addCandlestickSeries({
          priceFormat: {
            type: 'price',
            precision: `${precision_number}`,
            minMove: `${minMove_number}`,
        },
        });
        
        candleseries.setData(klinedata);


        
      
        //Makes chart responsive
        const chartContainer = document.getElementById('charts');
        
        new ResizeObserver(entries => {
        if (entries.length === 0 || entries[0].target !== chartContainer) { return; }
        const newRect = entries[0].contentRect;
        chart.applyOptions({ height: newRect.height, width: newRect.width });
      }).observe(chartContainer);
    
    //Simple moving average
    const sma_series = chart.addLineSeries({color: 'red', lineWidth: 1});
    const sma_data = klinedata.filter(d => d.sma).map(d => ({time:d.time, value:d.sma}));
    sma_series.setData(sma_data);
    
    const ema_series = chart.addLineSeries({color: 'green', lineWidth: 1});
    const ema_data = klinedata
    .filter(d => d.ema)
    .map(d => ({time:d.time, value:d.ema}));
    ema_series.setData(ema_data);

    candleseries.setMarkers(
      klinedata.filter((d) => d.long || d.short)
        .map((d) => 
          d.long
            ? {
              time: d.time,
              position: 'belowBar',
              color: '#AAFF00',
              shape: 'arrowUp',
              text: 'BUY',
            }
            : {
              time: d.time,
              position: 'aboveBar',
              color: 'red',
              shape: 'arrowDown',
              text: 'SELL',
            }
        )
    )
    
    //RSI
     /*const rsi_series = chart.addLineSeries({color: 'purple', lineWidth: 1, pane: 1,});
    const rsi_data = klinedata 
            .filter((d) => d.rsi)
            .map((d) => ({ time: d.time, value: d.rsi }));
      rsi_series.setData(rsi_data); */
    
    
    window.addEventListener('beforeprint', () => {
        chart.resize(600, 600);
      });
};
    
    renderChart();


}

getCharts();
