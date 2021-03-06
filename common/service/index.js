// const __api = 'https://wkf.088wanmei.com';
const __api = 'http://59.61.216.123:18980/jeezero-boblbee-app/';

function Request() {

	this.m_send = function(url, method, data, onok, onno, complete) {
		let access_token = uni.getStorageSync('access_token');
		var _data = {
			url: __api + url,
			method: method,
			header: {
				// Authorization: token,
				authorization: access_token,
				appname: "boblbee"
			},
			data: data,
			success(res) {
				if (res.data.code == 0) {
					onok ? onok(res.data) : null
				} else if (res.data.code >= 10112 && res.data.code <= 10115) {
					uni.removeStorageSync('access_token')
					console.log(getCurrentPages())
					var route = "/" + getCurrentPages()[getCurrentPages().length - 1].route
					let queryObj = JSON.stringify(getCurrentPages()[0].__displayReporter.query)
					uni.redirectTo({
						url: "/pages/index/index?redirect=" + route + "&queryObj=" + queryObj,
						success: () => {
							uni.showToast({
								title: res.data.message,
								icon: "none",
								success: () => {}
							})
						}
					})
				} else {
					console.log(res)
					uni.showToast({
						title: res.data.message,
						icon: "none",
						duration: 2000
					})
					onno ? onno(res.data) : null
				}
			},
			fail(err) {
				uni.showToast({
					title: err.data.message,
					icon: "none",
					duration: 2000
				})
				console.log(err)
				onno ? onno(err) : null
			},
			complete: () => {
				complete ? complete() : null
			}
		}
		if (method == "Post" || method == "PUT") {
			_data.header = {
				'content-type': 'application/x-www-form-urlencoded', //自定义请求头信息
				Authorization: uni.getStorageSync('access_token')
			}
		}

		uni.request(_data)
	}
}
const _req = new Request()
module.exports = {
	host: __api,
	home: {
		wx_login: function(d, onok, onno) { //微信登陆获取参数
			let _url = "v1/miniApp/wxlogin";
			_req.m_send(_url, "Post", d, onok, onno);
		},
		get_recommend_article: function(d, onok, onno) { //“首页”模块的推荐数据
			let _url = "v1/home/queryRecommendArticle";
			_req.m_send(_url, "Get", d, onok, onno);
		},
		get_foucs_article: function(d, onok, onno) { //“首页”模块的关注数据
			let _url = "v1/home/queryFocusArticle";
			_req.m_send(_url, "Get", d, onok, onno);
		},
		get_hotVip_List: function(d, onok, onno) { //APP“首页”模块，点击“火”图标，显示推送4个大V账号。这4个大V账号是获取转发数最多的四个，如果无转发数，则以原创数最多排序。
			let _url = "v1/home/getHotVipList";
			_req.m_send(_url, "Get", d, onok, onno);
		},
		hotVip: {
			get_info: function(d, onok, onno) { //APP“首页”模块，点击“火”的图标，进行大V列表，再点击某个大V进入大V主界面的顶部大V信息数据。
				let _url = "v1/home/getVipInfo";
				_req.m_send(_url, "Get", d, onok, onno);
			},
			get_all_list: function(d, onok, onno) { //APP“首页”模块，点击导航右侧“火”的图标，点击“更多”按钮，获取大V账号数据列表，且带首字字母索引，一次性获取完所有的大V数据
				let _url = "v1/home/getVipPageList";
				_req.m_send(_url, "Get", d, onok, onno);
			},
			toggle_followed: function(d, onok, onno) { //关注或取消关注大V用户
				let _url = "v1/home/attentionVipOrNo";
				_req.m_send(_url, "Post", d, onok, onno);
			},
		},
		article: {
			get_detail: function(d, onok, onno) { //内容相关功能，获取内容详情数据时用
				let _url = "v1/article/getArticleDetail";
				_req.m_send(_url, "Get", d, onok, onno);
			}
		}
	},
	helper: {
		get_query_list: function(d, onok, onno) { //获取APP“助手”模块的热门问题列表。
			let _url = "v1/search/query";
			_req.m_send(_url, "Get", d, onok, onno);
		},
	},
	center: {
		user: {
			get_detail: function(d, onok, onno) { //“我的”模块获取用户资料
				let _url = "v1/my/getDetail";
				_req.m_send(_url, "Get", d, onok, onno);
			},
		},
		address: {
			add: function(d, onok, onno) { //收货地址添加
				let _url = "v1/my/addAddress";
				_req.m_send(_url, "Post", d, onok, onno);
			},
			update: function(d, onok, onno) { //收货地址修改
				let _url = "v1/my/updateAddress";
				_req.m_send(_url, "Post", d, onok, onno);
			},
			deleted: function(d, onok, onno) { //收货地址删除
				let _url = "v1/my/delAddress";
				_req.m_send(_url, "Post", d, onok, onno);
			},
			get_list: function(d, onok, onno) { //获取收货地址列表
				let _url = "v1/my/getAddressList";
				_req.m_send(_url, "Get", d, onok, onno);
			},
			get_region: function(d, onok, onno) { //获取省市县街道的接口
				let _url = "v1/my/getRegion";
				_req.m_send(_url, "Get", d, onok, onno);
			},
		},
		record: {
			get_list: function(d, onok, onno) { //APP“我的”模块获取用户的浏览记录列表
				let _url = "v1/my/queryHistoryList";
				_req.m_send(_url, "Get", d, onok, onno);
			},
		}
	},
	classify: {
		get_top_category: function(d, onok, onno) { //获取分类头部数据列表
			let _url = "v1/category/getTopCategory";
			_req.m_send(_url, "Get", d, onok, onno);
		},
		get_sub_category: function(d, onok, onno) { //获取某个分类下的子类
			let _url = "v1/category/getSubCategory";
			_req.m_send(_url, "Get", d, onok, onno);
		},
		get_category_article: function(d, onok, onno) { //获取某个分类下的所以文章列表
			let _url = "v1/category/getCategoryArticlePageList";
			_req.m_send(_url, "Get", d, onok, onno);
		},
		get_sub_category_header: function(d, onok, onno) { //获取某个小类的详情头部信息
			let _url = "v1/category/getSubCategoryHeader";
			_req.m_send(_url, "Get", d, onok, onno);
		},
		toggle_followed: function(d, onok, onno) { //关注或取消关注某分类
			let _url = "v1/home/attentionCategoryOrNo";
			_req.m_send(_url, "Post", d, onok, onno);
		},
	}
}
