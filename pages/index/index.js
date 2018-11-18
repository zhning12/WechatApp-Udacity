const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
};

const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

Page({
  data: {
    nowTemp: '',
    nowWeather: '',
    nowWeatherBackground: '',
    hourlyWeather: [],
		todayDate:'',
		todayTemp:'',
  },
  getNow(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: '广州市'
      },
      success: res => {
        console.log(res.data.result);
        let result = res.data.result;
				this.setWeather(result);
				this.setHourlyWeather(result);
				this.setToday(result);
      },
      complete: () => {
        callback && callback();
      }
    })
  },
  onLoad() {
    this.getNow();
  },

  onPullDownRefresh() {
    this.getNow(() => {
      wx.stopPullDownRefresh();
    })
  },
  setWeather(result) {
    let weather = result.now.weather;
    let temp = result.now.temp;
    this.setData({
      nowTemp: temp + '°',
      nowWeather: weatherMap[weather],
      nowWeatherBackground: `/images/${weather}-bg.png`,
    });

    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    });
  },
  setHourlyWeather(result) {
		let forecast = result.forecast;
		let hourlyWeather = [];
		let nowHour = new Date().getHours();
		for (let i = 0; i < forecast.length; i++) {
			hourlyWeather.push({
				time: (3 * i + nowHour) % 24 + '时',
				temp: forecast[i].temp + '°',
				iconPath: `/images/${forecast[i].weather}-icon.png`
			});
		}
		hourlyWeather[0].time = '现在';
    this.setData({
      hourlyWeather: hourlyWeather
    })
  },
	setToday(result){
		let date = new Date();
		this.setData({
			todayTemp: `${result.today.minTemp}° - ${result.today.maxTemp}°`,
			todayDate:`${date.getFullYear()} - ${date.getMonth()+1} - ${date.getDate()} 今天`
		})
	},
	onTapDayWeather(){
		wx.navigateTo({
			url: '/pages/list/list',
		})
	}
})