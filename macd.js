const {log, error} = console;




const input = document.querySelector('input');
const submitBtn = document.querySelector('button');

if (localStorage.getItem('userinput') === null) {
  localStorage.setItem('userinput', "BTC");
}

if(localStorage.getItem('userselect') === null){
  localStorage.setItem('userselect', "1d");
}

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
        const url = `https://proxy-server-22.onrender.com/${localStorage.getItem('userinput')}USDT/${localStorage.getItem('userselect')}`
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
        let arrays =  filternumbers.slice(filternumbers.length - 100, filternumbers.length);
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
    
      /*  const bbands_lower_series = chart.addLineSeries({
        color: 'green',
        lineWidth: 1,
        pane: 0,
      });
      const bbands_lower_data = klinedata
        .filter((d) => d.bbands_lower)
        .map((d) => ({ time: d.time, value: d.bbands_lower }));
      bbands_lower_series.setData(bbands_lower_data);

      const bbands_upper_series = chart.addLineSeries({
        color: 'green',
        lineWidth: 1,
        pane: 0,
      });
      const bbands_upper_data = klinedata
        .filter((d) => d.bbands_upper)
        .map((d) => ({ time: d.time, value: d.bbands_upper }));
      bbands_upper_series.setData(bbands_upper_data);
  
      const bbands_middle_series = chart.addLineSeries({
        color: 'green',
        lineWidth: 1,
        pane: 0,
      });
      const bbands_middle_data = klinedata
        .filter((d) => d.bbands_middle)
        .map((d) => ({ time: d.time, value: d.bbands_middle }));
      bbands_middle_series.setData(bbands_middle_data); */
      
    
    //Markers

    candleseries.setMarkers(
      klinedata.filter((d) => d.longMACD || d.shortMACD)
        .map((d) => 
          d.longMACD
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
    
    /* These consists of your visuals within the chart. You can change the color*/
    const macd_fast_series = chart.addLineSeries({
      priceFormat:{
      type: 'price',
      precision: `${precision_number}`,
      minMove: `${minMove_number}`, 
  }, 
    color: 'green',
    lineWidth: 1,
    pane: 1,
  });
  const macd_fast_data = klinedata
  /* What this code does is filter out all the objects in the array to only include the values of the MACD in order to plot on the chart*/
    .filter((d) => d.macd_fast)
    .map((d) => ({ time: d.time, value: d.macd_fast }));
  macd_fast_series.setData(macd_fast_data);


   const macd_slow_series = chart.addLineSeries({
    priceFormat:{
      type: 'price',
      precision: `${precision_number}`,
      minMove: `${minMove_number}`,
  },
    color: 'red',
    lineWidth: 1,
    pane: 1,
  });
  const macd_slow_data = klinedata
    .filter((d) => d.macd_slow)
    .map((d) => ({ time: d.time, value: d.macd_slow }));
  macd_slow_series.setData(macd_slow_data); 


    const macd_histogram_series = chart.addHistogramSeries({
        pane: 1,
      });
      const macd_histogram_data = klinedata
        .filter((d) => d.macd_histogram)
        .map((d) => ({
          time: d.time,
          value: d.macd_histogram,
          color: d.macd_histogram > 0 ? 'green' : 'red',
        }));
      macd_histogram_series.setData(macd_histogram_data);


  /* const resistanceLine = rsi_series.createPriceLine({
    price: 70,
    color: 'red',
    linewidth: 2,
    pane: 1,
  })

  const resistanceLine2 = rsi_series.createPriceLine({
    price: 30,
    color: 'green',
    linewidth: 2,
    pane: 1,
  }) */
    
    
   
    
    window.addEventListener('beforeprint', () => {
        chart.resize(600, 600);
      });
};
    
    renderChart();


}

getCharts();
