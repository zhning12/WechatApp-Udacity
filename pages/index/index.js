const weatherMap = {
	'sunny': '晴天',
	'cloudy': '多云',
	'overcast': '阴',
	'lightrain': '小雨',
	'heavyrain': '大雨',
	'snow': '雪'
};

Page({
	data:{
		nowTemp: 14,
		nowWeather: '多云' ,
	},
	onLoad(){
		console.log('Hello World!'); wx.request({
			url: 'https://test-miniprogram.com/api/weather/now', //仅为示例，并非真实的接口地址
			data: {
				city: '广州市'
			},

			success: res => {
				console.log(res.data.result);
				let result = res.data.result;
				let weather = result.now.weather;
				let temp = result.now.temp;
				console.log(temp,weather);
				this.setData({
					nowTemp: temp + '°',
					nowWeather: weatherMap[weather]
				});
			}
		})
	},

	onPullDownRefresh(){
		
	}
})
